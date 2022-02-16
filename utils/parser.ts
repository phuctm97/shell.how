export interface SimpleToken {
  indices: [number, number]; // [start, end], end is exclusive
  value: string;
}

/**
 * Parse a command string into an ordered list of tokens. Each token has indices
 * to locate * where it is in the original string and a copy of its value.
 * Quoted strings are treated as a single token.
 *
 * @param commandString User's input
 */
export function parseToSimpleTokens(commandString: string): SimpleToken[] {
  const escaped = commandString.replace(
    /"(?:[^"\\]|\\.)*"/g, // Escape quoted strings into "..."
    (match) => `"${Array.from({ length: match.length - 1 }).join(".")}"`
  );

  const splits = escaped.split(" ");
  const tokens: SimpleToken[] = [];

  let index = 0;
  for (const split of splits) {
    if (!split) {
      // Empty split in between double spaces
      index++;
      continue;
    }

    tokens.push({
      indices: [index, index + split.length],
      value: commandString.substring(index, index + split.length),
    });
    index += split.length + 1;
  }

  return tokens;
}

export interface SpecToken extends SimpleToken, Fig.BaseSuggestion {
  type: "command" | "subcommand" | "option" | "argument";
}

export class InvalidTokenError extends Error {
  constructor(public token: SimpleToken, public description: string) {
    super(`${token.value}: ${description}`);
  }
}

/**
 * Parse simple tokens into detailed tokens with extra information from Fig's spec.
 *
 * @param spec Fig's spec
 * @param simpleTokens Simple tokens from `parseToSimpleTokens`
 */
export function parseToSpecTokens(
  spec: Fig.Subcommand,
  simpleTokens: SimpleToken[]
): SpecToken[] {
  const specTokens: SpecToken[] = [
    // First token is always the command name
    {
      ...simpleTokens[0],
      type: "subcommand",
      displayName: spec.displayName,
      icon: spec.icon,
      description: spec.description,
    },
  ];

  // Keep track of remaining arguments to accept for the subcommand, -1 means no more arguments
  let subcommandArgsIndex = -1;
  if (Array.isArray(spec.args) && spec.args.length > 0) subcommandArgsIndex = 0;
  else if (spec.args) subcommandArgsIndex = 0;

  for (let i = 1; i < simpleTokens.length; i++) {
    const token = simpleTokens[i];
    if (token.value.startsWith("-")) {
      // Is an option
      const option = spec.options?.find(({ name }) =>
        Array.isArray(name) ? name.includes(token.value) : token.value === name
      );
      if (!option) throw new InvalidTokenError(token, `option is unknown`);

      const optionToken: SpecToken = {
        ...token,
        type: "option",
        displayName: option.displayName,
        icon: option.icon,
        description: option.description,
      };
      specTokens.push(optionToken);
      if (!option.args) continue;

      // Iterate through all arguments of the option and merge them into a single token
      // with the option (because argument spec don't currently have good description, otherwise
      // we may want to treat arguments as separate tokens)
      const optionArgs = Array.isArray(option.args)
        ? option.args
        : [option.args];
      let j = 0;
      for (; j < optionArgs.length && i + j + 1 < simpleTokens.length; j++) {
        const argToken = simpleTokens[i + j + 1];
        optionToken.value += ` ${argToken.value}`;
        optionToken.indices[1] = argToken.indices[1];
      }
      i += j;
    } else {
      const subcommand = spec.subcommands?.find(({ name }) =>
        Array.isArray(name) ? name.includes(token.value) : token.value === name
      );
      if (subcommand) {
        // Is a subcommand, recursively parse subcommand
        specTokens.push(
          ...parseToSpecTokens(subcommand, simpleTokens.slice(i))
        );
        i = simpleTokens.length;
      } else {
        // It's an argument
        if (subcommandArgsIndex != -1 && spec.args) {
          const arg = Array.isArray(spec.args)
            ? spec.args[subcommandArgsIndex]
            : spec.args;
          specTokens.push({
            ...token,
            type: "argument",
            description: arg.description,
          });
          if (!arg.isVariadic) {
            if (
              Array.isArray(spec.args) &&
              subcommandArgsIndex + 1 < spec.args.length
            ) {
              subcommandArgsIndex++;
            } else {
              subcommandArgsIndex = -1; // Stop accepting subcommand's arguments
            }
          }
        } else {
          throw new InvalidTokenError(
            token,
            "is neither a valid subcommand, option, or argument"
          );
        }
      }
    }
  }
  return specTokens;
}

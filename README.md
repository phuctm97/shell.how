# shell.how

Write down a shell command-line to see how it works in details.

## Design

### Stack

- TypeScript

- Next.js

- Tailwind CSS

- Recoil for state management, it works natively with React concurrent mode & has builtin caching, allow lean pattern for querying dynamic data (see [hooks/use-spec.ts](hooks/use-spec.ts))

- React concurrent mode for loading data before rendering components & handling error

### Parser

The [parser](utils/parser.ts) has 2 steps:

1. Escape and split the string into tokens delimited white space, quoted strings are considered a single token. Nested quotes are supported, too.

2. Load spec for command (first token) read from step 1. Iterate through the tokens, validate and annotate the tokens with information from loaded spec.

```ts
interface Token extends SimpleToken, Fig.BaseSuggestion {
  indices: [number, number]; // [start, end], end is exclusive
  value: string; // a copy of [start, end) from original string
  type: "command" | "subcommand" | "option" | "argument";
}
```

## Improvements

- [ ] Parser: Handle single-quoted strings.

- [ ] Parser: Other improvements to make sure parser's first step always return correct number of tokens.

- [ ] Parser: Handle advanced syntax of options, (can use `yargs` or similar library to parse each option token).

- [ ] Parser: Handle arguments with `isOptional`, `isPersistent`, `isRepeatable`, etc, differently.

- [ ] Performance: Install Fig's completion spec locally and static render first result → avoid (many) network calls client-side.

- [ ] SEO: Generate static sitemaps for all commands defined in spec → increase SEO, potentially make this the best place to search & learn shell command 🔥.

- [ ] Socials: Generate OG image dynamically for command being queried.

import React, { useMemo } from "react";
import { HiExclamationCircle, HiXCircle } from "react-icons/hi";
import clsx from "clsx";
import { sentenceCase } from "sentence-case";

import useSpec from "hooks/use-spec";
import {
  SimpleToken,
  InvalidTokenError,
  parseToSimpleTokens,
  parseToSpecTokens,
} from "utils/parser";

interface Props {
  commandString: string;
  selection: [number | null, number | null];
  onSelectionChange: (selection: [number, number]) => void;
}

/**
 * Parse the command string and display an interactive list of tokens explaining the command.
 * The displayed tokens are hover-able and emit events when selection changes.
 * It also suspense when loading spec.
 */
const Explain: React.FC<Props> = ({
  commandString,
  selection,
  onSelectionChange,
}) => {
  const simpleTokens = useMemo<SimpleToken[]>(
    () => parseToSimpleTokens(commandString),
    [commandString]
  );

  const cmd = simpleTokens.length > 0 ? simpleTokens[0].value : "";
  const spec = useSpec(cmd);

  const parsed = useMemo(() => {
    if (!spec) return;
    try {
      return parseToSpecTokens(spec, simpleTokens);
    } catch (err) {
      if (err instanceof InvalidTokenError) return err;
      else throw err;
    }
  }, [spec, simpleTokens]);

  if (!cmd || !spec || !parsed)
    return (
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <HiExclamationCircle
              className="h-5 w-5 text-yellow-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <p className="text-sm text-yellow-700">
              {!cmd ? (
                "Empty command."
              ) : (
                <>
                  No spec found for{" "}
                  <span className="font-medium text-yellow-800">{cmd}</span>.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    );

  if (parsed instanceof InvalidTokenError)
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <HiXCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <p className="text-sm text-red-700">
              <span className="font-medium text-red-800">
                {parsed.token.value}
              </span>
              : {parsed.description}.
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col items-stretch space-y-4 select-none">
      {parsed.map((token) => (
        <div
          key={token.indices[0]}
          className={clsx(
            "bg-white text-gray-900 dark:bg-black dark:text-white shadow-md rounded p-4 border-2 border-transparent transition",
            selection[0] !== null &&
              selection[0] >= token.indices[0] &&
              selection[0] <= token.indices[1] &&
              "border-teal-400 opacity-100"
          )}
          onMouseEnter={() =>
            onSelectionChange([token.indices[0], token.indices[1]])
          }
          onClick={() =>
            onSelectionChange([token.indices[0], token.indices[1]])
          }
        >
          <div className="font-mono font-bold">
            <span>
              {token.value}
              {token.displayName ? ` - ${token.displayName}` : ""}
            </span>
          </div>
          <div>{token.description || sentenceCase(token.type)}</div>
        </div>
      ))}
    </div>
  );
};

export default Explain;

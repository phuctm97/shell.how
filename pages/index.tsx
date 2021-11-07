import type { NextPage } from "next";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { ImSpinner } from "react-icons/im";
import { HiInformationCircle, HiMoon, HiSun, HiTerminal } from "react-icons/hi";
import { useTheme } from "next-themes";

import ErrorBoundary from "components/error-boundary";
import Explain from "components/explain";
import SuggestedCommands from "components/suggested-commands";
import Info from "components/info";

const Loading = () => {
  return (
    <div className="mt-8 flex items-center justify-center">
      <ImSpinner className="animate-spin" />
    </div>
  );
};

const BlankState = (props: React.ComponentProps<typeof SuggestedCommands>) => {
  return (
    <div className="mt-8">
      <SuggestedCommands {...props} />
    </div>
  );
};

const Index: NextPage = () => {
  const commandInput = useRef<HTMLInputElement>(null);
  const [commandString, setCommandString] = useState<string>("");

  // Selection is used to locate which tokens to be highlighted
  const [selection, setSelection] = useState<[number | null, number | null]>([
    null,
    null,
  ]);

  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const { theme, setTheme } = useTheme();

  // Avoid rehydration mismatch of theme (https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <div className="max-w-7xl mx-auto py-14 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 sm:flex sm:flex-col sm:items-center">
        {/* Title */}
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white sm:text-center inline-flex items-center select-none">
          <HiTerminal className="mr-2" size="1.2em" />
          <span>shell</span>
          <span>.</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-600">
            how?
          </span>
        </h1>
        <p className="mt-2 sm:mt-4 text-xl text-gray-500 dark:text-gray-400 sm:text-center">
          Write down a command-line to see how it works
        </p>

        {/* Input */}
        <div className="self-center mt-8 bg-white dark:bg-black shadow-md w-full max-w-xl rounded overflow-hidden content">
          <div className="relative h-8 flex items-center justify-between shadow-sm">
            <div className="ml-4 flex space-x-2 items-center">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <div className="mr-4 text-gray-600 flex space-x-2 items-center">
              <button onClick={() => setIsInfoOpen(true)}>
                <HiInformationCircle />
              </button>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <HiMoon /> : <HiSun />}
              </button>
            </div>
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-sm font-light text-gray-500">
              Terminal
            </div>
          </div>
          <div className="px-4 py-3 font-mono flex items-center">
            <span className="text-gray-500 select-none">~</span>
            <input
              ref={commandInput}
              type="text"
              name="command-string"
              id="command-string"
              value={commandString}
              spellCheck="false"
              onChange={(e) => setCommandString(e.target.value.trimStart())}
              onClick={(e) =>
                setSelection([
                  e.currentTarget.selectionStart,
                  e.currentTarget.selectionEnd,
                ])
              }
              onKeyUp={(e) =>
                setSelection([
                  e.currentTarget.selectionStart,
                  e.currentTarget.selectionEnd,
                ])
              }
              className="flex-grow text-gray-900 dark:bg-black dark:text-white border-none outline-none focus:outline-none focus:ring-0 autofill:shadow-fill-white dark:autofill:shadow-fill-black"
              aria-label="Command"
            />
          </div>
        </div>

        {/* Output */}
        <div className="self-center mt-3 w-full max-w-xl">
          {commandString ? (
            <ErrorBoundary>
              <Suspense fallback={<Loading />}>
                <Explain
                  commandString={commandString}
                  selection={selection}
                  onSelectionChange={(selection) => {
                    setSelection(selection);
                    commandInput.current?.focus();
                    commandInput.current?.setSelectionRange(
                      selection[0],
                      selection[1]
                    );
                  }}
                />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <BlankState onSelectCommandString={setCommandString} />
          )}
        </div>
      </div>
      <Info open={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </>
  );
};

export default Index;

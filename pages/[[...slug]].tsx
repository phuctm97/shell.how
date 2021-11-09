import type { GetStaticPaths, GetStaticProps, NextPage } from "next";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ImSpinner } from "react-icons/im";
import {
  HiCheck,
  HiInformationCircle,
  HiLink,
  HiMoon,
  HiSun,
  HiTerminal,
} from "react-icons/hi";
import { SiGithub } from "react-icons/si";
import { useTheme } from "next-themes";

import Pkg from "package.json";
import ErrorBoundary from "components/error-boundary";
import Explain from "components/explain";
import SuggestedCommands from "components/suggested-commands";
import Info from "components/info";
import useCopyUrl from "hooks/use-copy-url";

const Loading = () => {
  return (
    <div className="mt-8 flex items-center justify-center text-gray-900 dark:text-gray-50">
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

interface StaticProps {
  initialCommandString: string;
}

const Index: NextPage<StaticProps> = ({ initialCommandString }) => {
  const commandInput = useRef<HTMLInputElement>(null);
  const [commandString, setCommandString] =
    useState<string>(initialCommandString);

  // Selection is used to locate which tokens to be highlighted
  const [selection, setSelection] = useState<[number | null, number | null]>([
    null,
    null,
  ]);

  // When user click share, update the current URL and copy it to clipboard for sharing
  const [hasCopiedUrl, copyUrl] = useCopyUrl();
  const share = useCallback(() => {
    window.history.pushState({}, "", `/${encodeURIComponent(commandString)}`);
    copyUrl();
  }, [commandString, copyUrl]);

  // Show/hide info modal when user clicks on info icon
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
          <a
            className="relative top-3.5 transform rotate-12 text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
            href={Pkg.repository}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiGithub size={18} />
          </a>
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
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                title="Toggle theme"
              >
                {theme === "dark" ? <HiMoon /> : <HiSun />}
              </button>
              <button
                onClick={() => setIsInfoOpen(true)}
                title="See site's info"
              >
                <HiInformationCircle />
              </button>
              <button
                onClick={share}
                title={hasCopiedUrl ? "Copied" : "Share"}
                disabled={hasCopiedUrl}
              >
                {hasCopiedUrl ? <HiCheck /> : <HiLink />}
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

export const getStaticProps: GetStaticProps<StaticProps> = async ({
  params,
}) => {
  const { slug = "" } = params ?? {};
  return {
    props: { initialCommandString: typeof slug === "string" ? slug : slug[0] },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Generate static pages for all commands on its first query
  return {
    paths: [],
    fallback: "blocking",
  };
};

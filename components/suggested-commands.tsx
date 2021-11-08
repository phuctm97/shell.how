import React from "react";
import { SiGit, SiLinux, SiNpm, SiYarn } from "react-icons/si";

interface Props {
  onSelectCommandString: (commandString: string) => void;
}

const suggestedCommands = [
  {
    command: 'echo "hello world"',
    icon: <SiLinux className="w-full h-full" />,
  },
  {
    command: "git push origin master --all",
    icon: <SiGit className="w-full h-full" />,
  },
  {
    command: "ls -a -l -p",
    icon: <SiLinux className="w-full h-full" />,
  },
  {
    command: "npm install -g react",
    icon: <SiNpm className="w-full h-full" />,
  },
  {
    command: 'git commit -m "hello world"',
    icon: <SiGit className="w-full h-full" />,
  },
  {
    command: "yarn publish --tag v1.0.0",
    icon: <SiYarn className="w-full h-full" />,
  },
];

const SuggestedCommands: React.FC<Props> = ({ onSelectCommandString }) => {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        Suggested commands
      </h3>
      <ul role="list" className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {suggestedCommands.map(({ icon, command }, index) => (
          <li key={index}>
            <button
              type="button"
              className="group p-2 w-full flex items-center justify-between rounded-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm space-x-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none"
              onClick={onSelectCommandString.bind(null, command)}
            >
              <span className="min-w-0 flex-1 flex items-center space-x-2 ml-1 text-gray-900 dark:text-gray-50">
                <span className="block h-4 w-4 flex-shrink-0">{icon}</span>
                <span className="block min-w-0 flex-1">
                  <span className="block text-sm font-medium truncate">
                    {command}
                  </span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestedCommands;

import type { NextPage } from "next";

import { useMemo, useState } from "react";

interface ParsedCommand {
  text: string;
  tokens: Array<{
    indices: [number, number]; // [start, end], end is exclusive
    type: string;
    value: string;
  }>;
}

const Index: NextPage = () => {
  const [text, setText] = useState<string>("");

  const parsedCommand = useMemo<ParsedCommand>(() => {
    const escaped = text
      .trim()
      .replace(
        /"(?:[^"\\]|\\.)*"/g,
        (match) => `"${Array.from({ length: match.length - 1 }).join("-")}"`
      );

    const split = escaped.split(" ");
    const tokens: ParsedCommand["tokens"] = [];

    let index = 0;
    for (const s of split) {
      tokens.push({
        type: "",
        indices: [index, index + s.length],
        value: text.substring(index, index + s.length),
      });
      index += s.length + 1;
    }

    return {
      text,
      tokens,
    };
  }, [text]);

  return (
    <div>
      <div>
        <label
          htmlFor="command"
          className="block text-sm font-medium text-gray-700"
        >
          Command
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="command"
            id="command"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>
      <div>{JSON.stringify(parsedCommand, null, 2)}</div>
    </div>
  );
};

export default Index;

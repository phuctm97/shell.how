import type { NextPage } from "next";

import { useEffect, useMemo, useState } from "react";

interface ParsedInput {
  command: string;
  tokens: Array<{
    indices: [number, number]; // [start, end], end is exclusive
    type: string;
    value: string;
  }>;
}

const Index: NextPage = () => {
  const [text, setText] = useState<string>("");

  const parsed = useMemo<ParsedInput>(() => {
    const escaped = text
      .trim()
      .replace(
        /"(?:[^"\\]|\\.)*"/g,
        (match) => `"${Array.from({ length: match.length - 1 }).join("-")}"`
      );

    const splits = escaped.split(" ");
    const tokens: ParsedInput["tokens"] = [];

    let index = 0;
    for (const split of splits) {
      tokens.push({
        type: "",
        indices: [index, index + split.length],
        value: text.substring(index, index + split.length),
      });
      index += split.length + 1;
    }

    return {
      command: tokens.length > 0 ? tokens[0].value : "",
      tokens,
    };
  }, [text]);

  const [spec, setSpec] = useState("");
  useEffect(() => {
    if (!parsed.command) {
      setSpec("");
      return;
    }
    (async () => {
      try {
        const url = `https://cdn.skypack.dev/@withfig/autocomplete/build/${parsed.command}.js`;
        const { default: spec } = await import(/* webpackIgnore: true */ url);
        setSpec(JSON.stringify(spec, null, 2));
      } catch {
        setSpec("");
      }
    })();
  }, [parsed.command]);

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
      <div>{JSON.stringify(parsed, null, 2)}</div>
      {spec}
    </div>
  );
};

export default Index;

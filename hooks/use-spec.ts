import { selectorFamily, useRecoilValue } from "recoil";

const specState = selectorFamily<Fig.Subcommand | undefined, string>({
  key: "spec",
  get: (cmd) => () =>
    import(
      /* webpackIgnore: true */ `https://cdn.skypack.dev/@withfig/autocomplete/build/${cmd}.js`
    )
      .then((mod) => mod.default)
      .catch(() => undefined),
});

/**
 * Return Fig's spec for a specific command, suspense when fetching,
 * results are cached and used in subsequent calls
 *
 * @param cmd The command to fetch the spec for
 */
export default function useSpec(cmd: string): Fig.Subcommand | undefined {
  return useRecoilValue(specState(cmd));
}

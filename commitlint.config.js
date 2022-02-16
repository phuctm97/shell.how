module.exports = {
  extends: ["@commitlint/config-angular"],
  ignores: [(commit) => /^build\((deps|deps-dev)\): bump/.test(commit)],
};

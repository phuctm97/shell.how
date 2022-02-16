module.exports = {
  "*.{js,jsx}": "eslint --fix",
  "*": ["prettier --write --ignore-unknown", "cspell --no-must-find-files"],
};

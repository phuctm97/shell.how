module.exports = {
  "*.{js,jsx,ts,tsx}": "eslint --fix",
  "*": ["prettier --write --ignore-unknown", "cspell --no-must-find-files"],
};

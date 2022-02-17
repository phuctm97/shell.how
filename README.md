# [shell.how](https://shell.how) &middot; [![CI](https://github.com/phuctm97/shell.how/actions/workflows/ci.yml/badge.svg)](https://github.com/phuctm97/shell.how/actions/workflows/ci.yml)

Explain shell commands using next-generation autocomplete from [Fig](https://fig.io).

<a href="https://www.producthunt.com/posts/shell-how?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-shell-how" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=332221&theme=light" alt="shell.how - Explain how your shell command works | Product Hunt" width="222" height="48" /></a>

## Contributing

### Requirements

- Node 14

- Yarn 1.22+

### Setup

1. Install requirements

2. Clone the repository

3. Run `yarn` to install dependencies

### Develop

#### Tech stack

- TypeScript

- Next.js

- Tailwind CSS

- Recoil for state management, it works natively with React concurrent mode & has builtin caching, allows lean pattern for querying dynamic data (see [hooks/use-spec.ts](hooks/use-spec.ts))

- React concurrent mode for loading data before rendering components & handling errors

#### Start development

- Run `yarn start` to start development

- Commit adhering to [Angular commit convention](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit), use `yarn commit` or [Code conventional commits](https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits) to commit interactively

- Submit a PR and make sure required status checks pass

- When a PR is merged or code is pushed to `main`:

  - Vercel deploys latest changes to [shell.how](https://shell.how)

  - Github validates and creates a new release if there're relevant changes

#### Understand parser

The [parser](utils/parser.ts) has 2 steps:

1. Escape and split the string into tokens delimited white space, a quoted string is a single token. Nested quotes are supported, too.

2. Load Fig's autocomplete spec for the command (the first token from step 1). Iterate through the tokens, validate, and annotate the tokens with information from the spec.

```ts
interface Token extends SimpleToken, Fig.BaseSuggestion {
  indices: [number, number]; // [start, end], end is exclusive
  value: string; // a copy of [start, end) from original string
  type: "command" | "subcommand" | "option" | "argument";
}
```

## Author

Minh-Phuc Tran ([@phuctm97](https://twitter.com/phuctm97)) - [Fig](https://fig.io)

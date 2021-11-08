# shell.how

Write down a shell command-line to see how it works in details.

## Design Choices

### Stack

Besides Next.js and TypeScript, following technologies were used:

- Tailwind CSS for fast styling UI.

- Recoil for state management, it works natively with React concurrent mode & has builtin caching, allow lean pattern for querying dynamic data (see [hooks/use-spec.ts](hooks/use-spec.ts))

- React concurrent mode for loading data before rendering components & handling error.

### Parser

The [parser](utils/parser.ts) has 2 steps:

1. Escape and split the string into tokens delimited white space, quoted strings are considered a single token. Nested quotes are supported too.

2. Load spec for command (first token) read from step 1. Iterate through the tokens, validate and annotate the tokens with information from loaded spec.

```ts
interface Token extends SimpleToken, Fig.BaseSuggestion {
  indices: [number, number]; // [start, end], end is exclusive
  value: string; // a copy of [start, end) from original string
  type: "command" | "subcommand" | "option" | "argument";
}
```

## Improvements

- Handle parser edge cases. This should be able to be done quite easily with existing data structures, to handle different option syntax, we can use `yargs` or similar library to parse each option token. Also handle argument with `isOptional` differently.

- Install Fig's completion spec locally, avoid (many) network calls as well as depending on Skypack's downtime.

- Generate static sitemaps for all commands defined in Fig's spec → increase SEO.

- Use [Next.js ISR](https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration) to generate static pages for better performance.

- Add autocomplete as the user is typing.

- Generate OG image dynamically for command being queried.

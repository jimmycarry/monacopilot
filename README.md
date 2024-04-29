# Monacopilot

Extended Monaco Editor with AI auto-completion and new themes for React.

## Documentation

[https://monacopilot.vercel.app/docs](https://monacopilot.vercel.app/docs)

## Contributing

#### Installation

The Monacopilot repository uses [PNPM Workspaces](https://pnpm.io/workspaces) and [Tsup](https://tsup.egoist.dev/). To install dependencies, run `pnpm install` in the project root directory.

#### Building the Package

To build the package, execute the following command:

```bash
 pnpm build
```

Alternatively, `pnpm dev` to start the watch mode for automatic rebuilds on file changes.

#### Testing Monacopilot Locally

To test Monacopilot locally, run:

```bash
pnpm dev:test
```

#### Adding or Editing Themes

To add a theme, you can add the `.tmTheme` file of the theme you want to include to the `themes` directory at the root. If you wish to edit any theme, simply edit the `.tmTheme` file of the theme you want to modify. Then, run the following command after updating or adding.

```bash
pnpm generate-themes
```

This command will read the theme you added/edited and automatically generate Monaco Editor-compatible theme data as if by magic. Additionally, it will automatically add the theme name to the theme type if you've added a new theme.

#### Contributing to the Documentation

If you wish to contribute to the documentation, use the following command:

```bash
pnpm dev:docs
```

Edit the `.mdx` files in the docs directory, and the documentation will refresh instantly, reflecting your changes.

---

We welcome contributions from the community to enhance Monacopilot's capabilities and make it even more powerful ❤️
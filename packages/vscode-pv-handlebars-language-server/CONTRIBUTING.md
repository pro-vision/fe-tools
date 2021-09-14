# Development

## Structure

```cmd
.
├── client // Language Client
│   ├── src
│   │   └── extension.ts // Language Client entry point
├── package.json // The extension manifest.
└── server // Language Server
    └── src
        └── server.ts // Language Server entry point
```

## Running in watch mode

- Run `npm install` in this folder. This installs all necessary npm modules in both the client and server folder
- Open VS Code on this folder.
- Run `npm run watch` in command line, or simply press Ctrl+Shift+B to compile the client and server.
- Switch to the Debug viewlet.
- Select `Launch Client` from the drop down.
- Run the launch config.
- If you want to debug the server as well use the launch configuration `Attach to Server`
- In the [Extension Development Host] instance of VSCode, open a workspace with a `.hbs` document in a p!v FE archetype based project.
  - type for example `{{> e` to trigger the completion list.

## Build and deploy locally

- run `vsce package` (or `npm run pkg`) to generate a .vsix file (in the releases directory). install it via "install from VSIX" from command pallet.

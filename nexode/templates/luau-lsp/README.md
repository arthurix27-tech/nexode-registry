# {{PROJECT_NAME}} - Luau LSP

A Language Server Protocol (LSP) implementation for the [Luau](https://luau-lang.org/) language.

## Features

- **Autocompletion**: Smart code completion for Luau.
- **Diagnostics**: Real-time error detection and linting.
- **Hover Information**: Display type and documentation on hover.
- **Go to Definition**: Navigate to symbol definitions.
- **Find References**: Find all references to a symbol.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd {{PROJECT_NAME}}
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Run the language server:
   ```bash
   npm run start
   ```

## Development

- **Watch Mode**: Run `npm run watch` to automatically rebuild on changes.
- **Testing**: Run `npm test` to execute tests.
- **Linting**: Run `npm run lint` to check for code style issues.

## Project Structure

```
{{PROJECT_NAME}}/
├── src/
│   ├── server.ts          # LSP server implementation
│   ├── language/          # Luau language features
│   │   ├── parser.ts      # Luau syntax parser
│   │   ├── validator.ts   # Code validation
│   │   └── ...
│   └── utils/             # Utility functions
├── test/                  # Tests
├── package.json           # Project configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## Configuration

Edit `src/server.ts` to customize the LSP server behavior. The server uses the [vscode-languageserver-node](https://github.com/microsoft/vscode-languageserver-node) library.

## License

MIT License. See [LICENSE](../../LICENSE) for details.

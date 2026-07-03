# Nexode

A Linux-exclusive package manager written in Python.

## Features

- **Install Packages**: `nexode install [PACKAGE-NAME]`
- **Remove Packages**: `nexode remove [PACKAGE-NAME]`
- **Create New Projects**: `nexode new [PROJECT-NAME]`
- **Linux Path Compatibility**: Handles standard Linux paths (`/usr/local/bin`, `~/.local/bin`, etc.).

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/arthurix27-tech/nexode-registry.git
   cd nexode-registry
   ```

2. Install the package:
   ```bash
   pip install -e .
   ```

3. Verify the installation:
   ```bash
   nexode --help
   ```

## Usage

### Install a Package
```bash
nexode install <package-name> [--version <version>]
```

### Remove a Package
```bash
nexode remove <package-name>
```

### Create a New Project
```bash
nexode new <project-name> [--template <template>]
```

## Project Structure

```
nexode/
├── __init__.py
├── cli.py          # Main CLI parser
├── main.py         # Entry point
├── commands/
│   ├── __init__.py
│   ├── install.py  # Install command logic
│   ├── remove.py   # Remove command logic
│   └── new.py      # New project command logic
└── utils/
    └── path.py     # Linux path handling
```

## License

MIT License. See [LICENSE](LICENSE) for details.

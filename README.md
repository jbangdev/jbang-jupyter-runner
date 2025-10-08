# Jupyter JBang Runner

A JupyterLab extension that adds a run button to `.java` and `.jsh` files, allowing you to execute them directly with [jbang](https://www.jbang.dev/).

![JupyterLab](https://img.shields.io/badge/JupyterLab-4.0+-orange.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Features

- 🚀 **Run Button**: Adds a run button (▶️) to the toolbar of `.java` and `.jsh` files
- 💾 **Auto-save**: Automatically saves files before running to ensure latest code is executed
- 🔄 **Terminal Reuse**: Reuses existing terminals per file to avoid clutter
- 📺 **Terminal Integration**: Executes files using jbang in an integrated terminal
- 🎯 **Smart Detection**: Only shows the run button for supported file types (`.java`, `.jsh`)

## Prerequisites

- JupyterLab 4.0+
- [jbang](https://www.jbang.dev/) installed and available in PATH
- Node.js and npm (for development)
- Python 3.8+ (for installation)

## Installation

### For Users

```bash
pip install jupyter-jbang-runner
```

### For Development

**Detailed guide**: See [CONTRIBUTING.md](./docs/DEVELOPMENT.md)

## Usage

1. **Open a Java or JSH file**: Open any `.java` or `.jsh` file in JupyterLab
2. **Click the Run Button**: Look for the run button (▶️) in the file editor toolbar
3. **View Output**: The file will be executed with jbang in a terminal tab

### Example Files

Create a simple Java file to test:

**HelloWorld.java**

```java
///usr/bin/env jbang "$0" "$@" ; exit $?

public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello from JBang!");
    }
}
```

Or a JShell script:

**example.jsh**

```java
///usr/bin/env jbang "$0" "$@" ; exit $?
//DEPS org.apache.commons:commons-lang3:3.12.0

import org.apache.commons.lang3.StringUtils;

System.out.println(StringUtils.capitalize("hello world"));
```

## How It Works

### Terminal Management

The extension creates one terminal per file:

- **First run**: Creates a new terminal named `jbang-FileName.java`
- **Subsequent runs**: Reuses the same terminal, just sends a new command
- **Different files**: Each file gets its own dedicated terminal

### Auto-save Feature

Before executing, the extension:

1. Checks if the file has unsaved changes
2. Automatically saves the file if needed
3. Then runs the jbang command with the latest code

This ensures you always run the current version of your code!

## Development

### Project Structure

```
jupyter-jbang-runner/
├── src/                    # TypeScript source code
│   ├── index.ts           # Extension entry point
│   └── runButton.ts       # Run button implementation
├── style/                  # CSS styles
├── jupyter_jbang_runner/  # Python package
│   ├── __init__.py
│   ├── _version.py
│   └── labextension/      # Built extension (generated)
├── lib/                    # Compiled JavaScript (generated)
├── package.json           # npm configuration
├── pyproject.toml         # Python package configuration
└── tsconfig.json          # TypeScript configuration
```

### Build Commands

```bash
# Clean build artifacts
npm run clean

# Build TypeScript only
npm run build:lib

# Build full extension
npm run build:prod

# Watch mode (auto-rebuild on changes)
npm run watch

# In another terminal (auto-reload JupyterLab)
jupyter lab --watch
```

### Testing

```bash
# Run the test script to check installation
./test-extension.sh

# For comprehensive local testing
./test-local.sh
```

See [LOCAL_TESTING.md](./LOCAL_TESTING.md) for detailed testing instructions.

### Debugging

See [DEBUG_EXTENSION.md](./DEBUG_EXTENSION.md) for debugging tips and common issues.

Key debugging steps:

1. Check browser console (F12) for `[jupyter-jbang-runner]` messages
2. Verify extension is installed: `jupyter labextension list`
3. Check for TypeScript compilation errors in build output

## Architecture

### Core Function: `runFileInTerminal`

The extension's main logic is in a single helper function that:

1. Auto-saves the file if needed
2. Looks for an existing terminal for this file
3. Reuses the terminal if found, or creates a new one
4. Sends the jbang command to the terminal
5. Activates the terminal to make it visible

### Integration Points

1. **Toolbar Button**: Added via `DocumentRegistry.IWidgetExtension`
2. **Command Palette**: Registered command `jupyter-jbang-runner:run-file`
3. **Terminal API**: Uses `@jupyterlab/terminal` for terminal management

## Configuration

Currently, the extension has no configuration options. The command format is fixed as:

```bash
jbang run "path/to/file.java"
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Troubleshooting

### Extension not appearing

```bash
# Check if installed
jupyter labextension list

# Rebuild JupyterLab
jupyter lab build --minimize=False

# Clear cache and restart
jupyter lab clean
jupyter lab
```

### Run button not working

1. Open browser console (F12)
2. Look for error messages with `[jupyter-jbang-runner]` prefix
3. Verify jbang is installed: `jbang version`
4. Check the [DEBUG_EXTENSION.md](./DEBUG_EXTENSION.md) guide

### Terminal not opening

- Check browser console for "unique id property" errors
- This usually means the extension needs to be rebuilt
- Run `npm run build:lib` and refresh the browser

## Documentation

- [DEVELOPMENT.md](./docs/DEVELOPMENT.md) - Complete development setup guide
- [LOCAL_TESTING.md](./docs/LOCAL_TESTING.md) - Development and local testing guide
- [DEBUG_EXTENSION.md](./docs/DEBUG_EXTENSION.md) - Debugging guide
- [CONTRIBUTING.md](./docs/CONTRIBUTING.md) - Contribution guidelines
- [USAGE.md](./docs/USAGE.md) - Detailed usage guide
- [AGENTS.MD](./AGENTS.MD) - AI agent context (architecture details)

## License

MIT License - see LICENSE file for details

## Credits

Built with:

- [JupyterLab](https://jupyterlab.readthedocs.io/)
- [jbang](https://www.jbang.dev/)
- [TypeScript](https://www.typescriptlang.org/)

## Changelog

See [CHANGES.md](../CHANGES.md) for version history and updates.

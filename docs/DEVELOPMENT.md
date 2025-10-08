# Development Setup Guide

This guide explains how to set up a complete development environment for the jupyter-jbang-runner extension.

## Prerequisites

You need these tools installed:

- **Python 3.8+** - Check with `python --version`
- **Node.js 16+** - Check with `node --version`
- **npm** - Comes with Node.js
- **uv** - Fast Python package manager (recommended)
- **jbang** - For testing the extension functionality

### Installing uv

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# macOS with Homebrew
brew install uv

# After installing, verify:
uv --version
```

### Installing jbang

```bash
# macOS/Linux
curl -Ls https://sh.jbang.dev | bash -s - app setup

# macOS with Homebrew
brew install jbangdev/tap/jbang

# Verify:
jbang version
```

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/jbangdev/jbang-jupyter-runner.git
cd jbang-jupyter-runner
```

### 2. Create Virtual Environment

We use `uv` for fast, reliable Python package management:

```bash
# Create a new virtual environment
uv venv

# Activate it (macOS/Linux)
source .venv/bin/activate

# On Windows:
# .venv\Scripts\activate
```

**Why use a virtual environment?**
- Isolates project dependencies from system Python
- Prevents version conflicts
- Makes it easy to clean up and start fresh

### 3. Install Python Dependencies

Install all required Python packages:

```bash
uv pip install -r requirements-dev.txt
```

**What gets installed:**

| Package | Version | Purpose |
|---------|---------|---------|
| `jupyterlab` | 4.0.0 - 4.9.9 | JupyterLab application |
| `hatchling` | ≥1.5.0 | Build backend |
| `hatch-nodejs-version` | ≥0.3.2 | Version sync with npm |
| `hatch-jupyter-builder` | ≥0.5 | JupyterLab extension builder |
| `pytest` | ≥7.0.0 | Testing framework |
| `pytest-jupyter` | ≥0.6.0 | JupyterLab testing utilities |

**Alternative**: Minimal install (just JupyterLab):
```bash
uv pip install jupyterlab
# Note: Build dependencies will still be installed automatically by pip install -e .
```

### 4. Install Node.js Dependencies

Install TypeScript compiler and JupyterLab build tools:

```bash
npm install
```

**What gets installed:**
- TypeScript compiler
- JupyterLab development libraries
- ESLint and Prettier for code quality
- Build tools (rimraf, npm-run-all)

### 5. Build the Extension

```bash
# Build TypeScript to JavaScript
npm run build:lib

# Or build everything (TypeScript + extension bundle)
npm run build:prod
```

### 6. Install the Extension

Install the Python package in editable mode:

```bash
pip install -e .
```

**What this does:**
- Installs the `jupyter-jbang-runner` Python package
- Creates a symlink so changes take effect immediately
- Installs build dependencies from `pyproject.toml`

Link the extension to JupyterLab:

```bash
jupyter labextension develop . --overwrite
```

**What this does:**
- Registers the extension with JupyterLab
- Creates a symlink to your development code
- Allows hot-reloading in watch mode

### 7. Build JupyterLab

Rebuild JupyterLab to include the extension:

```bash
jupyter lab build --minimize=False
```

**Why `--minimize=False`?**
- Makes debugging easier (readable JavaScript)
- Faster builds during development
- Better error messages

### 8. Verify Installation

Check that the extension is installed:

```bash
jupyter labextension list
```

Expected output:
```
JupyterLab v4.x.x
...
jupyter-jbang-runner v1.0.0 enabled OK (python, jupyter-jbang-runner)
```

## Development Workflow

### Starting JupyterLab

```bash
# Make sure virtual environment is activated
source .venv/bin/activate

# Start JupyterLab
jupyter lab
```

### Making Changes

#### TypeScript Changes (src/*.ts)

```bash
# Rebuild TypeScript
npm run build:lib

# Refresh browser (Cmd+R or Ctrl+R)
```

#### For Frequent Changes: Use Watch Mode

Terminal 1 - Auto-rebuild on save:
```bash
npm run watch
```

Terminal 2 - JupyterLab with auto-reload:
```bash
jupyter lab --watch
```

Now changes to TypeScript files will automatically:
1. Recompile (Terminal 1)
2. Reload in browser (Terminal 2)

#### CSS Changes (style/*.css)

Just refresh the browser - no rebuild needed!

#### Python Changes (jupyter_jbang_runner/*.py)

The extension has minimal Python code. If you change it:
```bash
# Restart JupyterLab server
# Press Ctrl+C in terminal, then:
jupyter lab
```

### Testing Your Changes

1. **Manual Testing**: Open a `.java` or `.jsh` file and click the run button
2. **Browser Console**: Open DevTools (F12) and look for `[jupyter-jbang-runner]` messages
3. **Extension List**: Run `jupyter labextension list` to verify installation

### Debugging

See [DEBUG_EXTENSION.md](./DEBUG_EXTENSION.md) for comprehensive debugging guide.

Quick checks:
```bash
# Check extension is enabled
jupyter labextension list | grep jbang

# Check Python package
python -c "import jupyter_jbang_runner; print(jupyter_jbang_runner.__version__)"

# Check for TypeScript errors
npm run build:lib
```

## Common Development Tasks

### Clean Build

Start fresh if things get corrupted:

```bash
# Clean all build artifacts
npm run clean:all

# Remove node_modules
rm -rf node_modules

# Reinstall and rebuild
npm install
npm run build:prod
jupyter lab build --minimize=False
```

### Update Dependencies

```bash
# Update npm packages
npm update

# Update Python packages
uv pip install --upgrade -r requirements-dev.txt

# Rebuild everything
npm run build:prod
jupyter lab build --minimize=False
```

### Run Tests

```bash
# Run Python tests (if you add them)
pytest

# Run TypeScript linter
npm run eslint:check
```

### Uninstall Extension

```bash
# Unlink from JupyterLab
jupyter labextension uninstall jupyter-jbang-runner

# Uninstall Python package
pip uninstall jupyter-jbang-runner

# Clean JupyterLab
jupyter lab clean

# Optionally remove virtual environment
deactivate
rm -rf .venv
```

## Project Structure

```
jbang-jupyter-runner/
├── src/                          # TypeScript source
│   ├── index.ts                 # Extension entry point
│   └── runButton.ts             # Core functionality
├── lib/                          # Compiled JavaScript (generated)
│   ├── index.js
│   └── runButton.js
├── style/                        # CSS styles
│   └── index.css
├── jupyter_jbang_runner/        # Python package
│   ├── __init__.py
│   ├── _version.py
│   └── labextension/            # Built extension bundle (generated)
├── node_modules/                # Node.js dependencies
├── .venv/                       # Python virtual environment
├── package.json                 # npm configuration
├── pyproject.toml              # Python package configuration
├── tsconfig.json               # TypeScript configuration
├── requirements-dev.txt        # Python dev dependencies
└── docs/                        # Documentation
    ├── DEVELOPMENT.md          # This file
    ├── LOCAL_TESTING.md        # Testing guide
    ├── DEBUG_EXTENSION.md      # Debugging guide
    └── CONTRIBUTING.md         # Contribution guidelines
```

## Understanding the Build Process

### TypeScript Compilation

```mermaid
src/index.ts ──┐
src/runButton.ts ──┤ tsc (TypeScript Compiler)
                   │
                   ├──> lib/index.js
                   └──> lib/runButton.js
```

### Extension Building

```mermaid
lib/*.js ──┐
style/*.css ──┤ jupyter labextension build
schema/*.json ──┤
                │
                └──> jupyter_jbang_runner/labextension/
                     ├── static/
                     ├── package.json
                     └── install.json
```

### Installation Flow

1. **`npm install`** - Installs Node.js dependencies
2. **`npm run build:lib`** - Compiles TypeScript to JavaScript
3. **`pip install -e .`** - Installs Python package (triggers hatch build)
4. **`jupyter labextension develop`** - Links extension to JupyterLab
5. **`jupyter lab build`** - Rebuilds JupyterLab assets

## Quick Reference Commands

```bash
# Setup (once)
uv venv && source .venv/bin/activate
uv pip install -r requirements-dev.txt
npm install
pip install -e .
jupyter labextension develop . --overwrite
npm run build:prod
jupyter lab build --minimize=False

# Daily development
source .venv/bin/activate
npm run watch           # Terminal 1
jupyter lab --watch     # Terminal 2

# Quick rebuild after changes
npm run build:lib       # TypeScript changes
jupyter lab build       # Extension changes

# Clean slate
npm run clean:all
rm -rf node_modules .venv
# Then run setup again

# Verify
jupyter labextension list
jupyter lab --version
npm run build:lib       # Should succeed with no errors
```

## Environment Variables

Useful for debugging:

```bash
# Enable verbose npm logging
export NPM_CONFIG_LOGLEVEL=verbose

# Enable JupyterLab debug mode
export JUPYTER_LOG_LEVEL=DEBUG

# Show all jupyter commands
export JUPYTER_ENABLE_LAB_LOGS=1

# Then start JupyterLab:
jupyter lab --debug
```

## Troubleshooting Setup

### "jupyter: command not found"

Virtual environment not activated or JupyterLab not installed:
```bash
source .venv/bin/activate
uv pip install jupyterlab
```

### "npm: command not found"

Node.js not installed:
```bash
# macOS
brew install node

# Check installation
node --version
npm --version
```

### "Module not found" errors

Node modules not installed:
```bash
rm -rf node_modules
npm install
```

### "Extension not found" in JupyterLab

Extension not built or linked:
```bash
npm run build:prod
jupyter labextension develop . --overwrite
jupyter lab build --minimize=False
```

### Permission errors

Don't use sudo with pip in a virtual environment:
```bash
# Wrong:
sudo pip install -e .

# Right:
source .venv/bin/activate
pip install -e .
```

## Next Steps

- **Start developing**: See [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Test your changes**: See [LOCAL_TESTING.md](./LOCAL_TESTING.md)
- **Debug issues**: See [DEBUG_EXTENSION.md](./DEBUG_EXTENSION.md)
- **Understand the code**: See [AGENTS.MD](../AGENTS.MD) for architecture details

## Getting Help

- Check browser console (F12) for error messages
- Look for `[jupyter-jbang-runner]` log messages
- Run `jupyter labextension list` to verify installation
- Check build output for TypeScript errors
- See [DEBUG_EXTENSION.md](./DEBUG_EXTENSION.md) for common issues

## Resources

- [JupyterLab Extension Tutorial](https://jupyterlab.readthedocs.io/en/stable/extension/extension_tutorial.html)
- [JupyterLab Extension Development Guide](https://jupyterlab.readthedocs.io/en/stable/extension/extension_dev.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [uv Documentation](https://docs.astral.sh/uv/)
- [jbang Documentation](https://www.jbang.dev/documentation/)


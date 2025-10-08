# Dependencies Reference

This document provides a complete reference of all dependencies required for the jbang-jupyter-runner extension.

## Overview

The extension has dependencies in three categories:

1. **System Tools** - Required on your machine
2. **Python Packages** - Installed via pip/uv
3. **Node.js Packages** - Installed via npm

## System Tools

These must be installed on your system before starting:

| Tool        | Version | Purpose                     | Installation                                           |
| ----------- | ------- | --------------------------- | ------------------------------------------------------ |
| **Python**  | 3.8+    | Runtime environment         | [python.org](https://www.python.org/downloads/)        |
| **Node.js** | 16+     | JavaScript runtime          | [nodejs.org](https://nodejs.org/)                      |
| **npm**     | 7+      | Node package manager        | Included with Node.js                                  |
| **uv**      | latest  | Fast Python package manager | `curl -LsSf https://astral.sh/uv/install.sh \| sh`     |
| **jbang**   | latest  | Java/JShell execution tool  | `curl -Ls https://sh.jbang.dev \| bash -s - app setup` |

**Check your versions:**

```bash
python --version    # Should be 3.8+
node --version      # Should be 16+
npm --version       # Should be 7+
uv --version        # Should be installed
jbang version       # Should be installed
```

## Python Dependencies

### Runtime Dependencies (pyproject.toml)

The extension itself has **zero runtime dependencies** for end users:

```toml
[project]
dependencies = []  # No runtime dependencies!
```

This means users can install with just `pip install jbang-jupyter-runner` without any extra packages.

### Build Dependencies (pyproject.toml)

Required when building or developing the extension:

```toml
[build-system]
requires = [
    "hatchling>=1.5.0",
    "jupyterlab>=4.0.0,<5",
    "hatch-nodejs-version>=0.3.2"
]
```

| Package                 | Version       | Purpose                                                  |
| ----------------------- | ------------- | -------------------------------------------------------- |
| `hatchling`             | ≥1.5.0        | Modern Python build backend                              |
| `jupyterlab`            | 4.0.0 - 4.9.9 | JupyterLab framework (required at build time)            |
| `hatch-nodejs-version`  | ≥0.3.2        | Syncs version between package.json and pyproject.toml    |
| `hatch-jupyter-builder` | ≥0.5          | Builds JupyterLab extensions (from jupyter-builder hook) |

**Note**: These are automatically installed when you run `pip install -e .`

### Development Dependencies (requirements-dev.txt)

Additional packages for development and testing:

```txt
# Core requirements
jupyterlab>=4.0.0,<5

# Build tools
hatchling>=1.5.0
hatch-nodejs-version>=0.3.2
hatch-jupyter-builder>=0.5

# Testing
pytest>=7.0.0
pytest-asyncio
pytest-cov
pytest-jupyter[server]>=0.6.0
coverage
```

| Package                  | Purpose                      |
| ------------------------ | ---------------------------- |
| `pytest`                 | Testing framework            |
| `pytest-asyncio`         | Async test support           |
| `pytest-cov`             | Code coverage                |
| `pytest-jupyter[server]` | JupyterLab testing utilities |
| `coverage`               | Coverage reporting           |

**Install all at once:**

```bash
uv pip install -r requirements-dev.txt
```

## Node.js Dependencies

### Production Dependencies (package.json)

These are JupyterLab APIs used by the extension:

```json
"dependencies": {
  "@jupyterlab/application": "^4.0.0",
  "@jupyterlab/apputils": "^4.0.0",
  "@jupyterlab/docregistry": "^4.0.0",
  "@jupyterlab/fileeditor": "^4.0.0",
  "@jupyterlab/launcher": "^4.0.0",
  "@jupyterlab/mainmenu": "^4.0.0",
  "@jupyterlab/notebook": "^4.0.0",
  "@jupyterlab/services": "^7.0.0",
  "@jupyterlab/terminal": "^4.0.0",
  "@jupyterlab/translation": "^4.0.0",
  "@jupyterlab/ui-components": "^4.0.0"
}
```

| Package                     | Purpose                            |
| --------------------------- | ---------------------------------- |
| `@jupyterlab/application`   | Main app integration               |
| `@jupyterlab/apputils`      | UI utilities                       |
| `@jupyterlab/docregistry`   | Document/widget registry           |
| `@jupyterlab/fileeditor`    | File editor integration            |
| `@jupyterlab/terminal`      | Terminal management (core feature) |
| `@jupyterlab/services`      | Backend services API               |
| `@jupyterlab/ui-components` | UI components (buttons, icons)     |
| Others                      | Additional JupyterLab APIs         |

**Note**: All JupyterLab packages are marked as "singleton" in the extension config, meaning they're provided by JupyterLab itself, not bundled with the extension.

### Development Dependencies (package.json)

Tools for building and testing:

```json
"devDependencies": {
  "@jupyterlab/builder": "^4.0.0",
  "@typescript-eslint/eslint-plugin": "^6.0.0",
  "@typescript-eslint/parser": "^6.0.0",
  "eslint": "^8.0.0",
  "eslint-config-prettier": "^8.0.0",
  "eslint-plugin-prettier": "^5.0.0",
  "npm-run-all": "^4.1.5",
  "prettier": "^3.0.0",
  "rimraf": "^5.0.0",
  "typescript": "~5.0.0"
}
```

| Package               | Purpose                               |
| --------------------- | ------------------------------------- |
| `typescript`          | TypeScript compiler (main build tool) |
| `@jupyterlab/builder` | JupyterLab extension builder          |
| `eslint`              | JavaScript/TypeScript linter          |
| `prettier`            | Code formatter                        |
| `rimraf`              | Cross-platform file deletion          |
| `npm-run-all`         | Run multiple npm scripts              |

**Install all at once:**

```bash
npm install
```

## Dependency Installation Order

For a fresh setup, follow this order:

```bash
# 1. System tools (one-time, global)
# Install Python, Node.js, uv, jbang (see above)

# 2. Create Python virtual environment
uv venv
source .venv/bin/activate

# 3. Install Python development dependencies
uv pip install -r requirements-dev.txt

# 4. Install Node.js dependencies
npm install

# 5. Install the extension itself (triggers build dependencies)
pip install -e .

# 6. Link to JupyterLab
jupyter labextension develop . --overwrite

# 7. Build everything
npm run build:prod
jupyter lab build --minimize=False
```

## Minimum Requirements

What do you **absolutely need** to get started?

### For End Users (just using the extension)

```bash
pip install jbang-jupyter-runner
```

That's it! No other Python packages needed.

### For Developers (minimum)

```bash
# Python side
uv venv && source .venv/bin/activate
uv pip install jupyterlab  # Just JupyterLab

# Node.js side
npm install

# Build and install
pip install -e .
jupyter labextension develop . --overwrite
npm run build:prod
jupyter lab build
```

### For Contributors (full setup)

```bash
# Python side
uv venv && source .venv/bin/activate
uv pip install -r requirements-dev.txt  # Everything including tests

# Node.js side
npm install

# Build and install
pip install -e .
jupyter labextension develop . --overwrite
npm run build:prod
jupyter lab build
```

## Dependency Management

### Updating Dependencies

```bash
# Update Python dependencies
uv pip install --upgrade -r requirements-dev.txt

# Update Node.js dependencies
npm update

# Check for outdated packages
npm outdated
```

### Version Pinning

- **Python**: We use flexible version ranges (e.g., `>=4.0.0,<5`) to allow compatibility
- **Node.js**: We use caret ranges (e.g., `^4.0.0`) for semver compatibility

### Lock Files

- **Python**: No lock file (requirements-dev.txt uses ranges)
- **Node.js**: `package-lock.json` (committed to git)

## Dependency Graph

```
jbang-jupyter-runner
│
├── Python Runtime
│   └── (none - zero dependencies!)
│
├── Python Build Time
│   ├── jupyterlab 4.x
│   ├── hatchling
│   ├── hatch-nodejs-version
│   └── hatch-jupyter-builder
│
├── Python Development
│   ├── (all build dependencies)
│   └── pytest, pytest-jupyter, etc.
│
└── Node.js
    ├── TypeScript compiler
    ├── JupyterLab APIs (@jupyterlab/*)
    └── Build tools (eslint, prettier, etc.)
```

## Troubleshooting Dependencies

### "ModuleNotFoundError: No module named 'jupyterlab'"

JupyterLab not installed:

```bash
source .venv/bin/activate
uv pip install jupyterlab
```

### "Cannot find module '@jupyterlab/...'"

Node modules not installed:

```bash
rm -rf node_modules package-lock.json
npm install
```

### "hatchling not found" or build errors

Build dependencies not installed:

```bash
uv pip install -r requirements-dev.txt
# or
pip install hatchling hatch-jupyter-builder
```

### Version conflicts

```bash
# Check what's installed
pip list | grep jupyter
npm list @jupyterlab/application

# Clean slate
pip uninstall jbang-jupyter-runner jupyterlab
uv pip install -r requirements-dev.txt
pip install -e .
```

## Why These Dependencies?

### Why JupyterLab 4.0+?

- Modern extension API
- Better TypeScript support
- Improved terminal management
- Active development and support

### Why TypeScript?

- Type safety prevents bugs
- Better IDE support
- Required by JupyterLab extensions
- Industry standard for large JavaScript projects

### Why uv?

- **Fast**: 10-100x faster than pip
- **Reliable**: Better dependency resolution
- **Modern**: Written in Rust, actively maintained
- **Compatible**: Drop-in replacement for pip

But you can use regular pip if you prefer:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
```

## Optional Dependencies

### For Production Builds

```bash
# Minimize bundle size
jupyter lab build --minimize
```

### For Documentation

```bash
pip install sphinx sphinx-rtd-theme
```

### For Profiling

```bash
pip install py-spy
npm install --save-dev webpack-bundle-analyzer
```

## Summary

**Quick reference:**

| Setup Type    | Python Command                           | Node Command  |
| ------------- | ---------------------------------------- | ------------- |
| Minimal       | `uv pip install jupyterlab`              | `npm install` |
| Development   | `uv pip install -r requirements-dev.txt` | `npm install` |
| Testing       | `+ pytest pytest-jupyter`                | Same          |
| Documentation | `+ sphinx`                               | Same          |

**Key files:**

- `requirements-dev.txt` - Python dependencies for development
- `pyproject.toml` - Python package configuration (build dependencies)
- `package.json` - Node.js dependencies and scripts
- `package-lock.json` - Node.js dependency lock file

**Next steps:**

- See [DEVELOPMENT.md](./DEVELOPMENT.md) for complete setup guide
- See [LOCAL_TESTING.md](./LOCAL_TESTING.md) for testing instructions

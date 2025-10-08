# Jupyter JBang Runner - Standalone Project

This extension is now fully self-contained and ready to be moved to its own repository.

## What's Included

All files needed for the extension are now in the `jbang-jupyter-runner/` directory:

### 📚 Documentation

- **README.md** - Main documentation with features, installation, and usage
- **CONTRIBUTING.md** - Guidelines for contributors
- **CHANGELOG.md** - Version history and development notes
- **LOCAL_TESTING.md** - Development setup and testing guide
- **DEBUG_EXTENSION.md** - Debugging tips and troubleshooting
- **EXTENSION_SETUP.md** - Initial setup notes
- **USAGE.md** - Detailed usage guide

### 🔧 Source Code

- **src/index.ts** - Extension entry point and registration
- **src/runButton.ts** - Main logic (toolbar button, terminal management)
- **style/index.css** - Extension styles

### 📦 Package Configuration

- **package.json** - npm dependencies and build scripts
- **pyproject.toml** - Python package configuration
- **tsconfig.json** - TypeScript configuration
- **MANIFEST.in** - Python package manifest
- **LICENSE** - MIT License

### 🧪 Testing & Development

- **test-extension.sh** - Quick extension check script
- **test-local.sh** - Full local testing setup script
- **quick-rebuild.sh** - Fast rebuild for development

### 🏗️ Build Output (generated, gitignored)

- **lib/** - Compiled JavaScript
- **jbang_jupyter_runner/labextension/** - Built extension
- **node_modules/** - npm dependencies
- **build.log** - Build output log

### 🚫 Git Configuration

- **.gitignore** - Ignores build artifacts and temporary files

## Moving to a Separate Repository

To create a standalone repository:

```bash
# 1. Create a new git repository
mkdir jbang-jupyter-runner-standalone
cd jbang-jupyter-runner-standalone
git init

# 2. Copy the extension directory
cp -r /path/to/jupyter-java-binder/jbang-jupyter-runner/* .

# 3. Clean up build artifacts
rm -rf node_modules lib build.log
rm -rf jbang_jupyter_runner/labextension
rm -rf jbang_jupyter_runner/__pycache__

# 4. Create initial commit
git add .
git commit -m "Initial commit: Jupyter JBang Runner extension"

# 5. Add remote and push
git remote add origin <your-repo-url>
git push -u origin main
```

## Development Workflow (Standalone)

Once in its own repository:

### First Time Setup

```bash
# Clone the repository
git clone <repository-url>
cd jbang-jupyter-runner

# Install dependencies
npm install
pip install -e .

# Link to JupyterLab
jupyter labextension develop . --overwrite

# Build
npm run build:prod
jupyter lab build --minimize=False
```

### Daily Development

```bash
# Terminal 1: Watch TypeScript
npm run watch

# Terminal 2: JupyterLab with auto-reload
jupyter lab --watch

# Make changes, save, and refresh browser!
```

### Testing

```bash
# Quick test
./test-extension.sh

# Full local setup
./test-local.sh

# Manual rebuild
./quick-rebuild.sh
```

## Publishing

### To npm (optional)

```bash
npm publish
```

### To PyPI

```bash
# Build distributions
python -m build

# Upload to PyPI
python -m twine upload dist/*
```

## Dependencies

### Runtime

- JupyterLab 4.0+
- jbang (must be installed separately)

### Development

- Node.js 16+
- Python 3.8+
- npm

### Python Packages

All listed in `pyproject.toml`:

- jupyterlab>=4.0.0

### npm Packages

All listed in `package.json`:

- @jupyterlab/\* packages
- TypeScript
- Build tools

## Key Features

✅ **Self-contained**: All code, docs, and scripts in one directory
✅ **Complete documentation**: Multiple guides for different use cases
✅ **Easy development**: Watch mode, quick rebuild scripts
✅ **Production ready**: Proper packaging, gitignore, license
✅ **Clean code**: Refactored, DRY principles, well-commented
✅ **Modern API**: Uses JupyterLab 4.0 Terminal API correctly

## What's Not Included

The parent directory still contains:

- **Example files** (HelloWorld.java, example.jsh, \*.ipynb) - These are for testing the binder setup, not part of the extension
- **postBuild** - Binder build script
- **requirements.txt** - Binder Python requirements
- **readme.md** - Binder project documentation

These are specific to the Jupyter Binder demo and should NOT be moved with the extension.

## Architecture Highlights

### Core Function

```typescript
async function runFileInTerminal(
  app: JupyterFrontEnd,
  filePath: string,
  context?: DocumentRegistry.IContext<any>
): Promise<void>;
```

This function:

1. Auto-saves the file if needed
2. Looks for existing terminal for this file
3. Reuses or creates terminal
4. Sends jbang command

### Extension Registration

- **Toolbar button**: via `DocumentRegistry.IWidgetExtension`
- **Command palette**: via `app.commands.addCommand`

### Terminal Management

- One terminal per file
- Terminal ID: `jbang-{filename}`
- Auto-activate when run

## Success Metrics

The extension successfully:

- ✅ Compiles without TypeScript errors
- ✅ Installs in JupyterLab
- ✅ Shows run button on .java and .jsh files
- ✅ Creates and reuses terminals correctly
- ✅ Auto-saves files before running
- ✅ Executes jbang commands properly
- ✅ Has comprehensive documentation
- ✅ Is ready for standalone deployment

## Next Steps

1. **Create standalone repository**
2. **Set up CI/CD** (GitHub Actions for testing)
3. **Publish to PyPI** (if making publicly available)
4. **Add badges to README** (build status, version, etc.)
5. **Create GitHub releases** with changelogs
6. **Add screenshots/GIFs** to README
7. **Set up issue templates**
8. **Add code of conduct**

## Questions?

All documentation is included. Start with:

- **README.md** for overview
- **CONTRIBUTING.md** for development
- **LOCAL_TESTING.md** for setup help

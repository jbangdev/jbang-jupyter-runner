# Jupyter JBang Runner Extension Setup

## What Was Fixed

The extension now properly installs in MyBinder by:

1. **Proper Python Packaging**: Created `pyproject.toml` and Python package structure
2. **JupyterLab Integration**: Using `jupyter labextension develop` instead of deprecated `install` command
3. **Lab Build**: Adding `jupyter lab build` to rebuild JupyterLab with the new extension
4. **Fixed serverextension command**: Updated from deprecated `jupyter serverextension` to `jupyter server extension`

## Key Changes

### Python Package Structure
```
jupyter-jbang-runner/
├── jupyter_jbang_runner/          # Python package
│   ├── __init__.py                # Package initialization
│   ├── _version.py                # Version info
│   └── labextension/              # Built extension (generated)
├── src/                           # TypeScript source
│   ├── index.ts
│   └── runButton.ts
├── pyproject.toml                 # Python package config
├── install.json                   # JupyterLab extension metadata
└── package.json                   # npm package config
```

### Installation Process (postBuild)

1. **Build Extension**:
   ```bash
   npm install --no-prepare
   npm run build:prod
   ```

2. **Install as Python Package**:
   ```bash
   pip install -e .
   ```

3. **Link to JupyterLab**:
   ```bash
   jupyter labextension develop . --overwrite
   ```

4. **Rebuild JupyterLab**:
   ```bash
   jupyter lab build --minimize=False
   ```

## Why This Works

- **Modern JupyterLab 4**: Uses the proper extension development workflow
- **Python Distribution**: Packages the extension as a Python package, which is the recommended way
- **Lab Build**: Rebuilds JupyterLab assets to include the extension code
- **Development Mode**: Uses `develop` mode which allows the extension to be loaded without building a wheel

## Testing Locally

To test the extension locally:

```bash
cd jupyter-jbang-runner
pip install -e .
jupyter labextension develop . --overwrite
jupyter lab build --minimize=False
jupyter lab
```

Then open a `.java` or `.jsh` file and look for the run button (▶️) in the toolbar.

## Verifying Installation

After JupyterLab starts, check:

1. **Extension is listed**:
   ```bash
   jupyter labextension list
   ```
   Should show `jupyter-jbang-runner` as enabled

2. **Console logs**: Open browser console and look for:
   ```
   JupyterLab extension jupyter-jbang-runner is activated!
   ```

3. **Run button appears**: Open any `.java` or `.jsh` file and check the toolbar

## Troubleshooting

If the run button doesn't appear:

1. Check extension is installed: `jupyter labextension list`
2. Check for errors in browser console (F12)
3. Verify lab was rebuilt: Look for `jupyter lab build` in postBuild output
4. Try clearing JupyterLab cache: `jupyter lab clean`

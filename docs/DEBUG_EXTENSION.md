# Debugging the Jupyter JBang Runner Extension

## 1. Check if Extension is Installed

In a terminal within JupyterLab, run:

```bash
jupyter labextension list
```

**Expected output:**

```
jbang-jupyter-runner v1.0.0 enabled OK (python, jbang-jupyter-runner)
```

**If it shows "uninstalled" or is missing:**

- The extension wasn't properly installed during postBuild
- Check the build logs for errors during `pip install -e .`

## 2. Check Browser Console for Errors

This is the **most important** debugging step:

1. Open JupyterLab in your browser
2. Open the browser's Developer Tools:
   - Chrome/Edge: Press `F12` or `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
   - Firefox: Press `F12` or `Ctrl+Shift+K` (Windows/Linux) / `Cmd+Option+K` (Mac)
3. Click on the **Console** tab
4. Look for errors or messages related to `jbang-jupyter-runner`

**Expected message:**

```
JupyterLab extension jbang-jupyter-runner is activated!
```

**Common errors to look for:**

- Module loading errors (e.g., "Failed to fetch module")
- JavaScript errors in the extension code
- TypeScript compilation errors that weren't caught
- Missing dependencies

## 3. Check Python Installation

In a JupyterLab terminal:

```bash
python -c "import jbang_jupyter_runner; print(jbang_jupyter_runner.__version__)"
python -c "import jbang_jupyter_runner; print(jbang_jupyter_runner._jupyter_labextension_paths())"
```

**Expected output:**

```
1.0.0
[{'src': 'labextension', 'dest': 'jbang-jupyter-runner'}]
```

## 4. Check if Files are Being Detected

Open a `.java` or `.jsh` file and check the browser console. You should see the extension attempting to add the button.

Add some debug logging to help troubleshoot. Check if these files exist:

```bash
# Check if labextension directory exists
ls -la ~/.local/share/jupyter/labextensions/jbang-jupyter-runner/

# Check if static files are present
ls -la ~/.local/share/jupyter/labextensions/jbang-jupyter-runner/static/
```

## 5. Rebuild JupyterLab

If the extension is installed but not working, try:

```bash
jupyter lab build --dev-build=False --minimize=False
```

Then restart JupyterLab.

## 6. Check JupyterLab Version Compatibility

```bash
jupyter lab --version
```

The extension requires JupyterLab 4.x. If you have a different version, there might be compatibility issues.

## 7. Enable Debug Mode

You can enable JupyterLab's debug mode by starting it with:

```bash
jupyter lab --debug
```

This will show more detailed logging in the terminal.

## 8. Common Issues and Solutions

### Issue: Extension shows as installed but run button doesn't appear

**Possible causes:**

1. **JavaScript not loading**: Check browser console for module loading errors
2. **File type detection failing**: The extension only adds buttons to `.java` and `.jsh` files
3. **Toolbar access issue**: The extension may not be able to access the file editor's toolbar

**Debug steps:**

1. Open browser console
2. Open a `.java` file
3. Look for any JavaScript errors
4. Check if you see the activation message

### Issue: Extension activates but button still doesn't appear

This might be a timing issue or the toolbar API changed. Check the browser console for errors when opening a file.

### Issue: "jbang-jupyter-runner needs to be included in build"

This means `jupyter lab build` wasn't run or failed. Check:

```bash
jupyter labextension list
```

If it shows as "uninstalled", rebuild:

```bash
jupyter lab build --minimize=False
```

## 9. Test with Simple JavaScript

Add this to the browser console to test if the extension is loaded:

```javascript
// Check if the extension is registered
console.log(
  window.jupyterapp?.commands?.hasCommand('jbang-jupyter-runner:run-file')
);
```

Should return `true` if the extension loaded correctly.

## 10. Check Network Tab

In browser DevTools:

1. Go to **Network** tab
2. Reload JupyterLab
3. Filter by "jbang" or "jbang-jupyter-runner"
4. Check if the extension's JavaScript files are loading (should see `remoteEntry.*.js`)

**If files are missing or returning 404:**

- The extension wasn't properly built or installed
- Run `jupyter lab build` again

## Quick Diagnostic Script

Run this in a JupyterLab terminal:

```bash
#!/bin/bash
echo "=== Extension Installation Check ==="
jupyter labextension list | grep -A 2 jbang-jupyter-runner

echo -e "\n=== Python Package Check ==="
python -c "import jbang_jupyter_runner; print('✓ Version:', jbang_jupyter_runner.__version__)" 2>&1

echo -e "\n=== JupyterLab Version ==="
jupyter lab --version

echo -e "\n=== Extension Files ==="
find ~/.local/share/jupyter/labextensions/jbang-jupyter-runner/ -type f 2>/dev/null | head -10

echo -e "\n=== Check if jbang is available ==="
which jbang && echo "✓ jbang found" || echo "✗ jbang not found"
```

## Most Likely Issue

Based on the symptoms (no errors but no button), the most likely cause is:

**The extension's JavaScript code is not properly accessing the file editor's toolbar**, possibly due to:

1. Timing issues (trying to add button before toolbar is ready)
2. API changes in JupyterLab 4.x
3. The file editor widget structure is different than expected

**Next step:** Check the browser console when opening a `.java` file to see any JavaScript errors.

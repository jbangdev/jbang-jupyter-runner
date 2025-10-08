# Testing Jupyter JBang Runner Extension Locally

## Prerequisites

You'll need:
- Python 3.8+
- uv (fast Python package manager)
- Node.js and npm

Install uv:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
# or
brew install uv
```

## Step 1: Create Virtual Environment

```bash
# Create virtual environment with uv
uv venv

# Activate it
source .venv/bin/activate

# Install JupyterLab
uv pip install jupyterlab
```

## Step 2: Build the Extension

```bash
cd jupyter-jbang-runner

# Install dependencies
npm install

# Build the extension
npm run build:prod
```

## Step 3: Install the Extension in Development Mode

```bash
# Install as Python package
uv pip install -e .

# Link the extension to JupyterLab
jupyter labextension develop . --overwrite

# Build JupyterLab to include the extension
jupyter lab build --minimize=False
```

## Step 4: Start JupyterLab

```bash
jupyter lab
```

JupyterLab will open in your browser (usually http://localhost:8888)

## Step 5: Test the Extension

1. **Create a test Java file:**
   - In JupyterLab, create a new file called `Test.java`
   - Add this content:
   ```java
   //usr/bin/env jbang "$0" "$@" ; exit $?
   
   public class Test {
       public static void main(String[] args) {
           System.out.println("Hello from JBang!");
       }
   }
   ```

2. **Check for the run button:**
   - Look for the run button (▶️) in the file editor toolbar
   - It should appear next to other toolbar buttons

3. **Test the run button:**
   - Click the run button
   - A new terminal should open
   - The `jbang run Test.java` command should execute
   - You should see "Hello from JBang!" in the terminal

## Step 6: Debug Issues

### Check Browser Console
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for `[jupyter-jbang-runner]` messages
4. Check for any errors

### Check Extension Installation
```bash
jupyter labextension list
```
Should show:
```
jupyter-jbang-runner v1.0.0 enabled OK (python, jupyter-jbang-runner)
```

### Check Python Package
```bash
python -c "import jupyter_jbang_runner; print('Version:', jupyter_jbang_runner.__version__)"
```

## Step 7: Make Changes and Rebuild

When you make changes to the TypeScript code:

```bash
# Rebuild the extension
npm run build:prod

# Rebuild JupyterLab (if needed)
jupyter lab build --minimize=False

# Refresh the browser page
```

## Step 8: Clean Up

To remove the extension:

```bash
# Uninstall the extension
jupyter labextension uninstall jupyter-jbang-runner

# Uninstall the Python package
pip uninstall jupyter-jbang-runner

# Clean JupyterLab
jupyter lab clean
```

## Troubleshooting

### Extension Not Appearing
- Check `jupyter labextension list`
- Try `jupyter lab build --minimize=False`
- Check browser console for errors

### Run Button Not Working
- Check browser console for `[jupyter-jbang-runner]` messages
- Verify jbang is installed: `jbang --version`
- Check if terminal opens but command doesn't execute

### Build Errors
- Make sure Node.js and npm are up to date
- Try `npm run clean` then `npm run build:prod`
- Check TypeScript errors in the build output

## Quick Test Script

Create a file `test-extension.sh`:

```bash
#!/bin/bash
echo "Testing Jupyter JBang Runner Extension Locally"
echo "=============================================="

# Build extension
echo "Building extension..."
cd jupyter-jbang-runner
npm run build:prod
cd ..

# Install extension
echo "Installing extension..."
pip install -e jupyter-jbang-runner/
jupyter labextension develop jupyter-jbang-runner/ --overwrite

# Build JupyterLab
echo "Building JupyterLab..."
jupyter lab build --minimize=False

echo "✅ Extension installed! Start JupyterLab with: jupyter lab"
```

Make it executable and run:
```bash
chmod +x test-extension.sh
./test-extension.sh
```

## Expected Console Output

When working correctly, you should see in the browser console:

```
[jupyter-jbang-runner] Extension activating...
[jupyter-jbang-runner] JupyterLab version: 4.x.x
[jupyter-jbang-runner] Widget extension registered with Editor factory
[jupyter-jbang-runner] Setup complete
[jupyter-jbang-runner] ✓ Extension activated successfully!
```

When opening a Java file:
```
[jupyter-jbang-runner] createNew called for: Test.java
[jupyter-jbang-runner] Adding run button for: Test.java
[jupyter-jbang-runner] ✓ Button added to toolbar
```

When clicking the run button:
```
[jupyter-jbang-runner] Run button clicked for: Test.java
[jupyter-jbang-runner] Terminal created: [object]
[jupyter-jbang-runner] Method 1: Looking for terminal instance...
[jupyter-jbang-runner] Method 2: Looking for xterm in DOM...
[jupyter-jbang-runner] Method 3: Looking for input element...
[jupyter-jbang-runner] Method 4: Looking for terminal canvas...
[jupyter-jbang-runner] Found canvas, focusing and simulating typing...
[jupyter-jbang-runner] ✓ Command sent via canvas keyboard events
```

## Next Steps

Once local testing works:
1. Commit your changes
2. Push to GitHub
3. Test on MyBinder
4. The MyBinder build should work the same way

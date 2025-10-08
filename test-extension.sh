#!/bin/bash

echo "Testing Jupyter JBang Runner Extension..."
echo "========================================="

# Check if jupyter is available
if ! command -v jupyter &> /dev/null; then
    echo "❌ Jupyter not found"
    exit 1
fi
echo "✓ Jupyter found"

# Check if the extension is listed
echo ""
echo "Checking installed extensions..."
if jupyter labextension list 2>&1 | grep -q "jbang-jupyter-runner"; then
    echo "✓ jbang-jupyter-runner extension is installed"
else
    echo "❌ jbang-jupyter-runner extension not found"
    echo ""
    echo "All installed extensions:"
    jupyter labextension list
    exit 1
fi

# Check if jbang is available
if ! command -v jbang &> /dev/null; then
    echo "⚠️  jbang not found (this is OK if running locally)"
else
    echo "✓ jbang found"
fi

echo ""
echo "========================================="
echo "✓ Extension appears to be properly installed!"
echo ""
echo "To test:"
echo "1. Start JupyterLab: jupyter lab"
echo "2. Open HelloWorld.java or example.jsh"
echo "3. Look for the run button (▶️) in the toolbar"
echo "4. Click it to execute the file with jbang"

#!/bin/bash

echo "🚀 Testing Jupyter JBang Runner Extension Locally"
echo "================================================="

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if we're in the extension directory or parent
if [ -f "$SCRIPT_DIR/package.json" ] && grep -q "jupyter-jbang-runner" "$SCRIPT_DIR/package.json"; then
    # We're in the extension directory
    cd "$SCRIPT_DIR/.."
elif [ -d "$SCRIPT_DIR/jupyter-jbang-runner" ]; then
    # We're in the parent directory
    cd "$SCRIPT_DIR"
else
    echo "❌ Error: Cannot find jupyter-jbang-runner directory"
    echo "Please run this script from the extension directory or its parent"
    exit 1
fi

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v uv &> /dev/null; then
    echo "❌ uv not found. Please install uv:"
    echo "   curl -LsSf https://astral.sh/uv/install.sh | sh"
    echo "   or: brew install uv"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js and npm"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Create virtual environment with uv
echo ""
echo "🐍 Creating virtual environment with uv..."
uv venv

# Activate virtual environment
source .venv/bin/activate

# Install development dependencies in virtual environment
echo "📦 Installing development dependencies (JupyterLab + build tools)..."
cd jupyter-jbang-runner
uv pip install -r requirements-dev.txt
cd ..

# Build extension
echo ""
echo "🔨 Building extension..."
cd jupyter-jbang-runner

if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm dependencies..."
    npm install
fi

echo "🔧 Building TypeScript and extension..."
npm run build:prod

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Extension built successfully"

# Install extension
echo ""
echo "📦 Installing extension..."
cd ..

# Install Python package in virtual environment
uv pip install -e jupyter-jbang-runner/

# Link extension to JupyterLab
jupyter labextension develop jupyter-jbang-runner/ --overwrite

# Build JupyterLab
echo "🏗️  Building JupyterLab..."
jupyter lab build --minimize=False

echo ""
echo "✅ Extension installed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Activate virtual environment: source .venv/bin/activate"
echo "2. Start JupyterLab: jupyter lab"
echo "3. Create a .java file (e.g., Test.java)"
echo "4. Look for the run button (▶️) in the toolbar"
echo "5. Click it to test the extension"
echo ""
echo "🔍 To debug:"
echo "- Open browser console (F12) and look for [jupyter-jbang-runner] messages"
echo "- Check extension list: jupyter labextension list"
echo ""
echo "🧹 To clean up later:"
echo "- jupyter labextension uninstall jupyter-jbang-runner"
echo "- uv pip uninstall jupyter-jbang-runner"
echo "- jupyter lab clean"
echo "- rm -rf .venv"

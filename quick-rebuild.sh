#!/bin/bash
set -e

echo "🔧 Quick Rebuild Script"
echo "======================="

cd "$(dirname "$0")"

echo ""
echo "📦 Installing npm dependencies..."
npm install

echo ""
echo "🧹 Cleaning old builds..."
npm run clean

echo ""
echo "🔨 Building TypeScript..."
npm run build:lib

echo ""
echo "📦 Building JupyterLab extension..."
jupyter labextension build . 2>&1 | tee build.log

echo ""
echo "✅ Build complete! Check build.log for any errors."
echo ""
echo "Now run: jupyter lab"


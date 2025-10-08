#!/bin/bash

# Install the jbang-jupyter-runner extension
echo "Installing jbang-jupyter-runner extension..."

# Install npm dependencies
npm install --no-prepare

# Build the extension
npm run build:prod

# Install the Python package in development mode
pip install -e .

# Link the extension (development install)
jupyter labextension develop . --overwrite

# Build JupyterLab to include the extension
jupyter lab build --minimize=False

echo "jbang-jupyter-runner extension installed successfully!"
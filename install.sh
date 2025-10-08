#!/bin/bash

# Install the jupyter-jbang-runner extension
echo "Installing jupyter-jbang-runner extension..."

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

echo "jupyter-jbang-runner extension installed successfully!"
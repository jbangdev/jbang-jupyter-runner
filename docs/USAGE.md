# Jupyter JBang Runner Extension

This Jupyter Lab extension adds a run button to `.java` and `.jsh` files, allowing you to execute them directly with jbang.

## Features

- **Run Button**: Adds a run button (▶️) to the toolbar of `.java` and `.jsh` files
- **Terminal Integration**: Executes files using jbang in a new terminal
- **Automatic Detection**: Only shows the run button for supported file types
- **Seamless Integration**: Works with Jupyter Lab's file editor

## Usage

1. **Open a Java or JSH file**: Open any `.java` or `.jsh` file in Jupyter Lab
2. **Click the Run Button**: Look for the run button (▶️) in the file editor toolbar
3. **View Output**: The file will be executed with jbang in a new terminal tab

## Example Files

The repository includes example files to test the extension:

- `HelloWorld.java` - A simple Java program with Picocli
- `example.jsh` - A JSH script using Apache Commons Lang

## Installation

The extension is automatically installed when you build the Binder environment using the `postBuild` script.

### What the postBuild script does:

1. Installs and configures jbang
2. Installs all Java kernels (jbang, jjava, rapaio, kotlin, ijava)
3. Builds the jbang-jupyter-runner extension
4. Installs the extension as a Python package
5. Links the extension to JupyterLab
6. Rebuilds JupyterLab to include the new extension

This process ensures the run button appears in the toolbar when you open `.java` or `.jsh` files.

## Development

To develop or modify the extension:

```bash
cd jbang-jupyter-runner
npm install
npm run watch  # For development with auto-reload
```

## How it Works

1. The extension monitors file editors in Jupyter Lab
2. When a `.java` or `.jsh` file is opened, it adds a run button to the toolbar
3. Clicking the run button creates a new terminal and executes `jbang run <filename>`
4. The output appears in the terminal

## Requirements

- Jupyter Lab 4.0+
- jbang installed and available in PATH
- Java kernels (automatically installed via postBuild script)

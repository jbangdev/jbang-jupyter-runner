# Contributing to Jupyter JBang Runner

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

### Prerequisites

- Python 3.8+
- Node.js 16+ and npm
- JupyterLab 4.0+
- git

### Initial Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/jbangdev/jbang-jupyter-runner
   cd jbang-jupyter-runner
   ```

2. **Setup virtual dev environment for Jupyter**
   ```bash
   uv venv
   source .venv/bin/activate
   uv pip install -e .
   ```
3. **Install Node dependencies**

   ```bash
   jlpm install
   ```

4. **Install in development mode**

   ```bash
   jupyter labextension develop . --overwrite
   ```

5. **Build the extension**
   ```bash
   npm run build:prod
   jupyter lab build --minimize=False
   ```

## Development Workflow

### Making Changes

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** in the `src/` directory

3. **Rebuild and test**
   ```bash
   npm run build:lib
   # Refresh JupyterLab in browser
   ```

### Live Development

For faster iteration:

```bash
# Terminal 1: Watch TypeScript files
npm run watch

# Terminal 2: Start JupyterLab with auto-reload
jupyter lab --watch
```

Now you can:

- Edit `src/*.ts` files
- Save your changes
- Refresh the browser to see updates

### Testing Your Changes

1. **Build and test**

   ```bash
   ./quick-rebuild.sh
   ```

2. **Manual testing**
   - Create a `.java` or `.jsh` file
   - Check that the run button appears
   - Click it and verify it works
   - Check browser console for errors

3. **Verify installation**
   ```bash
   ./test-extension.sh
   ```

## Project Structure

```
jbang-jupyter-runner/
├── src/
│   ├── index.ts           # Extension registration
│   └── runButton.ts       # Main logic (toolbar button, terminal management)
├── style/
│   └── index.css          # Extension styles
├── jbang_jupyter_runner/  # Python package
│   ├── __init__.py
│   └── _version.py
├── package.json           # npm dependencies
├── pyproject.toml         # Python package config
└── tsconfig.json          # TypeScript config
```

## Key Components

### `runFileInTerminal` Function

The core logic that:

1. Auto-saves files if needed
2. Finds or creates terminals
3. Executes jbang commands

### `RunButtonExtension` Class

Adds the run button to file editor toolbars for `.java` and `.jsh` files.

### Command Registration

Registers the `jbang-jupyter-runner:run-file` command for the command palette.

## Debugging

### Browser Console

Always check the browser console (F12) when debugging:

- Look for `[jbang-jupyter-runner]` prefixed messages
- Check for JavaScript errors
- Verify terminal creation and command sending

### Common Issues

**Extension not loading:**

```bash
jupyter labextension list  # Check if installed
jupyter lab build          # Rebuild JupyterLab
```

**Changes not appearing:**

```bash
npm run clean
npm run build:lib
# Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
```

**Terminal issues:**

- Check that `term.id` is set before adding to shell
- Verify terminal session is available before sending commands

## Testing

### Manual Testing Checklist

- [ ] Run button appears on `.java` files
- [ ] Run button appears on `.jsh` files
- [ ] Run button does NOT appear on other files
- [ ] Clicking run button creates a terminal
- [ ] Terminal executes jbang command
- [ ] File is auto-saved before running
- [ ] Subsequent runs reuse the same terminal
- [ ] Different files get different terminals
- [ ] Terminal tab has correct label (e.g., "JBang: HelloWorld.java")
- [ ] Command palette command works
- [ ] No errors in browser console

### Test Files

Create these test files:

**Test.java**

```java
///usr/bin/env jbang "$0" "$@" ; exit $?

public class Test {
    public static void main(String[] args) {
        System.out.println("Hello from Test.java!");
    }
}
```

**test.jsh**

```java
///usr/bin/env jbang "$0" "$@" ; exit $?

System.out.println("Hello from test.jsh!");
```

## Pull Request Process

1. **Update documentation** if needed
2. **Test thoroughly** using the checklist above
3. **Commit with clear messages**

   ```bash
   git commit -m "feat: add support for X"
   git commit -m "fix: resolve terminal reuse issue"
   ```

4. **Push your branch**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a pull request**
   - Describe what changed and why
   - Reference any related issues
   - Include screenshots if UI changed

## Commit Message Guidelines

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Examples:

```
feat: add auto-save before running files
fix: resolve terminal ID collision issue
docs: update README with installation steps
refactor: extract terminal creation into helper function
```

## Release Process

(For maintainers)

1. Update version in `package.json` and `_version.py`
2. Update CHANGES.md
3. Build and test
4. Create git tag
5. Publish to npm (if applicable)
6. Publish to PyPI (if applicable)

## Getting Help

- Open an issue for bugs or feature requests
- Check existing issues for similar problems
- Look at [DEBUG_EXTENSION.md](./DEBUG_EXTENSION.md) for debugging tips
- Review [LOCAL_TESTING.md](./LOCAL_TESTING.md) for setup help

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to open an issue for any questions about contributing!

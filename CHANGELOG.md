# Changelog

All notable changes to the Jupyter JBang Runner extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-XX

### Added

- Initial release of Jupyter JBang Runner extension
- Run button in toolbar for `.java` and `.jsh` files
- Auto-save feature before running files
- Terminal reuse per file (one terminal per file)
- Command palette integration
- Terminal management with proper widget IDs
- Clean terminal creation using JupyterLab 4.0 Terminal API

### Features

- 🚀 One-click execution of Java files with jbang
- 💾 Automatic file saving before execution
- 🔄 Smart terminal reuse to avoid clutter
- 📺 Integrated terminal output
- 🎯 File-type detection (only shows for .java and .jsh)

### Technical Details

- Built for JupyterLab 4.0+
- Uses `@jupyterlab/terminal` for terminal management
- Implements `DocumentRegistry.IWidgetExtension` for toolbar buttons
- Registers command `jbang-jupyter-runner:run-file` for command palette

### Documentation

- Comprehensive README with usage and development guide
- LOCAL_TESTING.md for development setup
- DEBUG_EXTENSION.md for troubleshooting
- CONTRIBUTING.md with contribution guidelines
- Example test files included

---

## Development History

### Key Refactorings

**Terminal Creation Cleanup**

- Simplified from 200+ lines of polling/fallback logic to ~60 lines
- Proper use of Terminal constructor with session parameter
- Eliminated complex terminal session waiting logic

**Code Deduplication**

- Extracted `runFileInTerminal` helper function
- Reduced duplicate code between toolbar button and command palette
- Single source of truth for terminal management

**Auto-save Implementation**

- Added automatic file saving before execution
- Checks `context.model.dirty` to detect unsaved changes
- Ensures jbang always runs the latest code

**Terminal Reuse**

- Implemented per-file terminal identification
- Searches existing terminals before creating new ones
- Terminal IDs based on filename (e.g., `jbang-HelloWorld.java`)

### API Evolution

**Initial Approach** (attempted):

```typescript
term = new Terminal({ initialCommand: 'jbang etc' });
term.session = await app.serviceManager.terminals.startNew();
```

❌ Failed: `initialCommand` not supported, `session` is read-only

**Current Approach**:

```typescript
const session = await app.serviceManager.terminals.startNew();
const term = new Terminal(session);
term.id = `jbang-${fileName}`;
// Then send command via session.send()
```

✅ Works correctly with JupyterLab 4.0 API

---

## Future Considerations

### Potential Enhancements

- [ ] Configuration options for jbang command flags
- [ ] Support for running with arguments
- [ ] Option to clear terminal before each run
- [ ] Progress indicators for long-running executions
- [ ] Stop/interrupt button for running processes
- [ ] Support for other JVM languages (Kotlin, Scala, etc.)
- [ ] Keyboard shortcuts
- [ ] Run history per file

### Known Limitations

- Requires jbang to be installed and in PATH
- No built-in jbang installation
- Terminal management limited to current JupyterLab session
- No persistent terminal history across JupyterLab restarts

---

## Links

- [JupyterLab Documentation](https://jupyterlab.readthedocs.io/)
- [jbang Documentation](https://www.jbang.dev/)
- [JupyterLab Extension Guide](https://jupyterlab.readthedocs.io/en/stable/extension/extension_dev.html)

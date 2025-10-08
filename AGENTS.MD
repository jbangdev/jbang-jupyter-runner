# AI Agent Context: Jupyter JBang Runner Extension

This document provides comprehensive context for AI coding assistants working on this JupyterLab extension.

## Project Overview

**Purpose**: A JupyterLab 4.0+ extension that adds a run button to `.java` and `.jsh` files to execute them with jbang in an integrated terminal.

**Key Feature**: One-click execution with auto-save, terminal reuse, and clean UX.

## Critical Architecture Decisions

### 1. Terminal Management Pattern

**The Correct Way (Current)**:
```typescript
// Step 1: Start terminal session
const session = await app.serviceManager.terminals.startNew();

// Step 2: Create Terminal widget WITH the session
const term = new Terminal(session);

// Step 3: Set unique ID BEFORE adding to shell
term.id = `jbang-${fileName}`;
term.title.label = `JBang: ${fileName}`;

// Step 4: Add to shell
app.shell.add(term, 'main', { mode: 'split-bottom' });

// Step 5: Send command
session.send({ type: 'stdin', content: [`jbang run "${filePath}"\n`] });
```

**What DOESN'T Work** (don't try these):
```typescript
// ❌ WRONG: initialCommand doesn't exist
const term = new Terminal({initialCommand: 'jbang run file.java'});

// ❌ WRONG: session is read-only
const term = new Terminal();
term.session = session;  // TypeError: cannot assign to read-only property

// ❌ WRONG: No ID before adding to shell
app.shell.add(term, 'main');  // Error: "unique id property required"
term.id = 'terminal-1';  // Too late!
```

### 2. Terminal Reuse Strategy

**One terminal per file**, identified by filename:
```typescript
const terminalName = `jbang-${fileName}`;  // e.g., "jbang-HelloWorld.java"

// Search existing terminals
const widgets = app.shell.widgets('main');
for (const widget of widgets) {
  if (widget instanceof Terminal && widget.id === terminalName) {
    // Reuse this terminal
    existingTerminal = widget;
    break;
  }
}
```

**Why**: Prevents terminal proliferation. Each file gets exactly one terminal that persists across multiple runs.

### 3. Auto-Save Implementation

**Always save before running**:
```typescript
if (context && context.model.dirty) {
  await context.save();
}
```

**Why**: Ensures jbang always runs the latest code, not stale disk version.

### 4. Code Organization

**Single source of truth**: All terminal logic in `runFileInTerminal()` helper function.

**Two entry points** both call the same helper:
1. Toolbar button (`RunButtonExtension.createNew`)
2. Command palette (`jbang-jupyter-runner:run-file`)

**Why**: DRY principle - changes in one place affect both.

## File Structure & Responsibilities

```
src/
├── index.ts           # Extension registration ONLY
│                      # - Activates extension
│                      # - Registers widget extension
│                      # - Returns extension object
│
└── runButton.ts       # ALL business logic
    ├── runFileInTerminal()           # Core function (Terminal mgmt)
    ├── RunButtonExtension            # Toolbar button handler
    └── addRunButton()                # Command palette + setup
```

### index.ts (40 lines)
- **DO**: Register the extension, activate it
- **DON'T**: Put business logic here
- Imports from `runButton.ts` and registers it

### runButton.ts (200 lines)
- **Core function**: `runFileInTerminal(app, filePath, context?)`
- **Extension class**: `RunButtonExtension` - adds toolbar button
- **Setup function**: `addRunButton()` - registers command palette

## Key TypeScript Patterns

### Extension Registration (index.ts)
```typescript
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jbang-jupyter-runner:plugin',
  autoStart: true,
  requires: [IDocumentManager, ITranslator],
  optional: [ICommandPalette],
  activate: (app, docManager, translator, palette) => {
    addRunButton(app, docManager, translator, palette || null);
  }
};
```

### Widget Extension (runButton.ts)
```typescript
export class RunButtonExtension implements DocumentRegistry.IWidgetExtension<any, any> {
  createNew(widget: any, context: DocumentRegistry.IContext<any>): IDisposable {
    // Check file type
    const fileName = context.path.split('/').pop() || '';
    if (!fileName.endsWith('.java') && !fileName.endsWith('.jsh')) {
      return { dispose: () => {}, get isDisposed() { return false; } };
    }
    
    // Create button
    const button = new ToolbarButton({
      onClick: async () => {
        await runFileInTerminal(this.app, context.path, context);
      }
    });
    
    widget.toolbar.insertItem(10, 'jbangRun', button);
    return button;
  }
}
```

## Important Implementation Details

### Console Logging Convention
**ALWAYS** use `[jbang-jupyter-runner]` prefix:
```typescript
console.log('[jbang-jupyter-runner] ✓ Terminal session started');
console.error('[jbang-jupyter-runner] Failed to run file:', error);
```

**Why**: Easy to filter in browser console, helps debugging.

### Terminal Activation
```typescript
// Make terminal visible
app.shell.activateById(term.id);
```

**Call this** after adding to shell, both for new and existing terminals.

### Command Format
```typescript
const command = `jbang run "${filePath}"\n`;  // Note the \n at end!
```

**The `\n` is critical** - it executes the command immediately.

## Common Tasks

### Adding a New Feature

1. **Modify core logic** in `runFileInTerminal()` if it affects terminal behavior
2. **Update both button and command** if it affects UI
3. **Rebuild**: `npm run build:lib`
4. **Test**: Refresh browser, check console logs

### Debugging Strategy

1. **Check browser console** (F12) for `[jbang-jupyter-runner]` messages
2. **Verify extension loaded**: `jupyter labextension list`
3. **Check TypeScript compilation**: Look for errors in `npm run build:lib`
4. **Common issue**: Old JavaScript cached - hard refresh (Cmd+Shift+R)

### Testing Checklist

```typescript
// Create test file
const testCases = [
  'Test.java',      // Should show button
  'test.jsh',       // Should show button  
  'test.py',        // Should NOT show button
];

// Test scenarios
1. Button appears on .java files ✓
2. Button appears on .jsh files ✓
3. Button does NOT appear on other files ✓
4. First run creates terminal ✓
5. Second run reuses terminal ✓
6. Different files get different terminals ✓
7. Unsaved changes are saved before run ✓
8. Terminal shows with correct label ✓
9. Command executes successfully ✓
```

## Dependencies & Versions

### Critical Imports
```typescript
import { JupyterFrontEnd } from '@jupyterlab/application';
import { Terminal } from '@jupyterlab/terminal';  // For terminal creation
import { DocumentRegistry } from '@jupyterlab/docregistry';  // For context
import { IDocumentManager } from '@jupyterlab/docmanager';  // For file mgmt
```

### Version Requirements
- JupyterLab: `^4.0.0` (uses JupyterLab 4.0 Terminal API)
- Node.js: 16+
- Python: 3.8+

**Why JupyterLab 4.0+**: Terminal API changed significantly. Our implementation uses the new API.

## Known Issues & Gotchas

### Issue 1: "unique id property" Error
**Symptom**: `Widgets added to app shell must have unique id property`

**Cause**: Adding terminal to shell before setting `term.id`

**Fix**: Always set `term.id` BEFORE `app.shell.add()`

### Issue 2: Session is Read-Only
**Symptom**: `Cannot assign to 'session' because it is a read-only property`

**Cause**: Trying to assign session after Terminal construction

**Fix**: Pass session to Terminal constructor: `new Terminal(session)`

### Issue 3: Terminal Doesn't Open
**Symptom**: Button click does nothing, no terminal appears

**Causes**:
1. Old JavaScript cached - hard refresh browser
2. Extension not rebuilt - run `npm run build:lib`
3. TypeScript errors - check compilation output

### Issue 4: Widget Finding Returns Wrong Terminal
**Original issue**: Using `widget.id` to find terminals

**Problem**: JupyterLab may reuse widget IDs

**Fix**: We tried `widget.title.dataset.id` but ultimately just use `widget.id` with proper naming

## API Reference Quick Lookup

### Terminal Creation
```typescript
// Start session
const session = await app.serviceManager.terminals.startNew();

// Create widget
const term = new Terminal(session);
term.id = 'unique-id';
term.title.label = 'Display Name';
term.title.closable = true;

// Add to shell
app.shell.add(term, 'main', { mode: 'split-bottom' });
app.shell.activateById(term.id);

// Send command
session.send({ type: 'stdin', content: ['command\n'] });
```

### Context Usage
```typescript
// Check if dirty
if (context.model.dirty) {
  await context.save();
}

// Get file path
const filePath = context.path;
const fileName = context.path.split('/').pop() || '';
```

### Widget Search
```typescript
const widgets = app.shell.widgets('main');
for (const widget of widgets) {
  if (widget instanceof Terminal && widget.id === targetId) {
    // Found it
  }
}
```

## Development Workflow

### Quick Rebuild
```bash
npm run build:lib          # Rebuild TypeScript
# Refresh browser (Cmd+R)
```

### Watch Mode
```bash
# Terminal 1
npm run watch              # Auto-rebuild on save

# Terminal 2  
jupyter lab --watch        # Auto-reload JupyterLab
```

### Full Rebuild
```bash
npm run clean
npm run build:prod
jupyter lab build --minimize=False
```

## Design Philosophy

### Simplicity First
- One terminal per file (not per session, not global)
- Auto-save always (don't ask user)
- Reuse terminals (avoid clutter)

### User Experience
- No confirmation dialogs
- Immediate feedback via console logs
- Terminal activates automatically

### Code Quality
- DRY: Single `runFileInTerminal()` function
- Clear naming: `jbang-{filename}` pattern
- Extensive logging: Every step logged
- Type safety: Use TypeScript properly

## Future Enhancement Ideas

Documented for future consideration:

```typescript
// Configuration options
interface JBangRunnerConfig {
  clearTerminalBeforeRun?: boolean;
  jbangFlags?: string[];
  showProgressIndicator?: boolean;
  terminalPosition?: 'split-bottom' | 'split-right';
}

// Stop button
// Would need to track running process PIDs
// Send interrupt signal to terminal session

// Run with arguments
// Could show input dialog before running
// Format: `jbang run "${filePath}" ${args}\n`

// Keyboard shortcuts
// Register in index.ts with keybinding
```

## Testing the Extension

### Manual Test Script
```bash
# 1. Install in dev mode
cd jbang-jupyter-runner
pip install -e .
jupyter labextension develop . --overwrite
npm run build:prod
jupyter lab build --minimize=False

# 2. Start JupyterLab
jupyter lab

# 3. Create Test.java
# 4. Click run button
# 5. Check console for:
#    - [jbang-jupyter-runner] messages
#    - No errors
#    - Terminal output

# 6. Click run again
# 7. Verify terminal reused (check console logs)
```

### Verify Installation
```bash
jupyter labextension list
# Should show: jbang-jupyter-runner v1.0.0 enabled OK
```

## Emergency Fixes

### If completely broken:
```bash
cd jbang-jupyter-runner
npm run clean
rm -rf node_modules lib
npm install
npm run build:prod
jupyter labextension develop . --overwrite
jupyter lab build --minimize=False
# Hard refresh browser (Cmd+Shift+R)
```

### If terminal creation fails:
Check the Terminal constructor call in `runFileInTerminal()`:
```typescript
const term = new Terminal(session);  // Must pass session here
```

### If terminals multiply:
Check terminal ID generation:
```typescript
const terminalName = `jbang-${fileName}`;  // Must be consistent
```

## Questions to Ask User

When starting work:
1. What JupyterLab version are you using? (Must be 4.0+)
2. Is jbang installed and in PATH?
3. What's the current issue/feature request?
4. Have you tried rebuilding? (`npm run build:lib`)
5. What do you see in browser console?

## File Change Impact

| File Modified | Rebuild Command | What to Test |
|---------------|----------------|--------------|
| `src/runButton.ts` | `npm run build:lib` | Button functionality |
| `src/index.ts` | `npm run build:lib` | Extension loads |
| `style/index.css` | Hard refresh | Button appearance |
| `package.json` | `npm install` + rebuild | Dependencies |
| `pyproject.toml` | `pip install -e .` | Python package |

## Success Indicators

Extension working correctly when:
- ✅ `jupyter labextension list` shows it enabled
- ✅ Browser console shows `[jbang-jupyter-runner] ✓ Extension activated`
- ✅ Run button appears on .java files
- ✅ Console shows terminal creation logs
- ✅ Terminal executes jbang command
- ✅ Subsequent runs reuse same terminal
- ✅ No TypeScript errors in build
- ✅ No JavaScript errors in browser console

## Quick Reference Commands

```bash
# Build
npm run build:lib

# Watch mode
npm run watch

# Clean rebuild
npm run clean && npm run build:prod

# Check installation
jupyter labextension list

# View source
cat src/runButton.ts

# Check compiled output
cat lib/runButton.js

# Full rebuild JupyterLab
jupyter lab build --minimize=False

# Clean JupyterLab
jupyter lab clean
```

## Summary for AI Agents

**Key Insight**: This extension's complexity is in terminal management. The pattern is: create session → create Terminal(session) → set ID → add to shell → send command. Everything else is straightforward React-style event handling.

**When debugging**: 99% of issues are either:
1. Terminal not created correctly (check constructor)
2. ID not set before shell.add (check order)
3. Old JavaScript cached (hard refresh)
4. TypeScript not compiled (rebuild)

**When enhancing**: Modify `runFileInTerminal()` function. Both entry points (button + command) call it, so changes apply everywhere.

**Documentation**: This file + README.md + CONTRIBUTING.md should answer most questions. STANDALONE.md explains deployment.


import { JupyterFrontEnd } from '@jupyterlab/application';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { ITranslator } from '@jupyterlab/translation';
import { ToolbarButton, ICommandPalette } from '@jupyterlab/apputils';
import { runIcon } from '@jupyterlab/ui-components';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { IDisposable } from '@lumino/disposable';
import { Terminal } from '@jupyterlab/terminal';

/**
 * Helper function to run a file with jbang in a terminal
 */
async function runFileInTerminal(
  app: JupyterFrontEnd,
  filePath: string,
  context?: DocumentRegistry.IContext<any>
): Promise<void> {
  // Save the file before running if context is provided
  if (context && context.model.dirty) {
    console.log('[jbang-jupyter-runner] File has unsaved changes, saving...');
    await context.save();
    console.log('[jbang-jupyter-runner] ✓ File saved');
  }

  const command = `jbang run "${filePath}"\n`;
  const fileName = filePath.split('/').pop() || '';
  const terminalName = `jbang-${fileName}`;

  console.log(
    '[jbang-jupyter-runner] Looking for existing terminal:',
    terminalName
  );

  // Check if a terminal for this file already exists
  let existingTerminal: any = null;
  const widgets = app.shell.widgets('main');
  for (const widget of widgets) {
    console.log('[jbang-jupyter-runner] Checking widget:', widget.id);
    if (
      widget instanceof Terminal &&
      widget.title.dataset.id === terminalName
    ) {
      existingTerminal = widget;
      console.log(
        '[jbang-jupyter-runner] ✓ Found existing terminal, reusing it'
      );
      break;
    }
  }

  let term: Terminal;

  if (existingTerminal) {
    // Reuse existing terminal
    term = existingTerminal;
  } else {
    // Create a new terminal session
    console.log('[jbang-jupyter-runner] Creating new terminal for:', fileName);
    const session = await app.serviceManager.terminals.startNew();
    console.log('[jbang-jupyter-runner] ✓ Terminal session started');

    // Create a new terminal widget with the session
    term = new Terminal(session);
    term.id = terminalName;
    term.title.label = `JBang: ${fileName}`;
    term.title.closable = true;

    // Add terminal to shell
    app.shell.add(term, 'main', { mode: 'split-bottom' });
    console.log('[jbang-jupyter-runner] ✓ Terminal added to shell');
  }

  // Activate the terminal to make it visible
  app.shell.activateById(term.id);

  // Send the command to the terminal
  if (term.session) {
    term.session.send({ type: 'stdin', content: [command] });
    console.log('[jbang-jupyter-runner] ✓ Command sent to terminal');
  } else {
    console.error('[jbang-jupyter-runner] Terminal session not available');
  }
}

/**
 * A widget extension that adds a run button to file editors
 */
export class RunButtonExtension
  implements DocumentRegistry.IWidgetExtension<any, any>
{
  constructor(
    private app: JupyterFrontEnd,
    private translator: ITranslator
  ) {
    console.log('[jbang-jupyter-runner] RunButtonExtension created');
  }

  createNew(widget: any, context: DocumentRegistry.IContext<any>): IDisposable {
    console.log('[jbang-jupyter-runner] createNew called for:', context.path);

    const fileName = context.path.split('/').pop() || '';

    // Only add button for .java and .jsh files
    if (!fileName.endsWith('.java') && !fileName.endsWith('.jsh')) {
      console.log(
        '[jbang-jupyter-runner] Not a Java file, skipping:',
        fileName
      );
      return {
        dispose: () => {},
        get isDisposed() {
          return false;
        }
      };
    }

    console.log('[jbang-jupyter-runner] Adding run button for:', fileName);

    const trans = this.translator.load('jbang-jupyter-runner');
    //const runCommand = 'jbang-jupyter-runner:run-file';

    // Create the run button
    const button = new ToolbarButton({
      className: 'jbang-run-button',
      icon: runIcon,
      onClick: async () => {
        console.log(
          '[jbang-jupyter-runner] Run button clicked for:',
          context.path
        );
        try {
          await runFileInTerminal(this.app, context.path, context);
        } catch (error) {
          console.error('[jbang-jupyter-runner] Failed to run file:', error);
        }
      },
      tooltip: trans.__('Run this file with jbang')
    });

    // Add button to toolbar
    widget.toolbar.insertItem(10, 'jbangRun', button);
    console.log('[jbang-jupyter-runner] ✓ Button added to toolbar');

    return button;
  }
}

/**
 * Add a run button to file editors for .java and .jsh files
 */
export function addRunButton(
  app: JupyterFrontEnd,
  docManager: IDocumentManager,
  translator: ITranslator,
  palette: ICommandPalette | null
): void {
  console.log('[jbang-jupyter-runner] Setting up run button functionality');

  const trans = translator.load('jbang-jupyter-runner');

  // Create the widget extension
  const extension = new RunButtonExtension(app, translator);

  // Register the extension with the document registry
  //const fileTypes = ['java', 'jsh'];

  // Try to get widget factory for file editor
  docManager.registry.addWidgetExtension('Editor', extension);
  console.log(
    '[jbang-jupyter-runner] Widget extension registered with Editor factory'
  );

  // Add command for running files
  const runCommand = 'jbang-jupyter-runner:run-file';
  if (!app.commands.hasCommand(runCommand)) {
    app.commands.addCommand(runCommand, {
      label: trans.__('Run with jbang'),
      icon: runIcon,
      execute: async () => {
        console.log('[jbang-jupyter-runner] Run command executed from palette');
        const widget = app.shell.currentWidget;
        if (!widget) {
          console.warn('[jbang-jupyter-runner] No current widget');
          return;
        }

        const context = docManager.contextForWidget(widget);
        if (!context) {
          console.warn('[jbang-jupyter-runner] No context for widget');
          return;
        }

        const filePath = context.path;
        const fileName = filePath.split('/').pop() || '';

        if (!fileName.endsWith('.java') && !fileName.endsWith('.jsh')) {
          console.warn('[jbang-jupyter-runner] Not a Java file:', fileName);
          return;
        }

        try {
          await runFileInTerminal(app, filePath, context);
        } catch (error) {
          console.error('[jbang-jupyter-runner] Failed to run file:', error);
        }
      }
    });

    // Add to command palette
    if (palette) {
      palette.addItem({
        command: runCommand,
        category: 'File Operations'
      });
    }
  }

  console.log('[jbang-jupyter-runner] Setup complete');
}

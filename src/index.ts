import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IDocumentManager } from '@jupyterlab/docmanager';

import { ITranslator } from '@jupyterlab/translation';

import { ICommandPalette } from '@jupyterlab/apputils';

import { addRunButton } from './runButton';

/**
 * Initialization data for the jbang-jupyter-runner extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jbang-jupyter-runner:plugin',
  autoStart: true,
  requires: [IDocumentManager, ITranslator],
  optional: [ICommandPalette],
  activate: (
    app: JupyterFrontEnd,
    docManager: IDocumentManager,
    translator: ITranslator,
    palette: ICommandPalette | null
  ) => {
    console.log('[jbang-jupyter-runner] Extension activating...');
    console.log('[jbang-jupyter-runner] JupyterLab version:', app.version);

    // Add run button to file editors
    addRunButton(app, docManager, translator, palette);

    console.log('[jbang-jupyter-runner] ✓ Extension activated successfully!');
  }
};

export default plugin;

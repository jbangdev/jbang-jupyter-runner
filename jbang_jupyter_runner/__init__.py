"""
Jupyter JBang Runner - A JupyterLab extension to run Java and JSH files with jbang
"""

__version__ = "1.0.0"

def _jupyter_labextension_paths():
    """
    Returns metadata about the JupyterLab extension.
    """
    return [{
        "src": "labextension",
        "dest": "jbang-jupyter-runner"
    }]

"""
New project command for Nexode.
"""

from pathlib import Path
from typing import Optional

from nexode.utils.path import LinuxPath


class NewCommand:
    """Handles the creation of a new project."""

    def __init__(self, project_name: str, template: Optional[str] = None):
        self.project_name = project_name
        self.template = template
        self.current_dir = Path.cwd()

    def execute(self) -> bool:
        """Execute the new project command."""
        print(f"Creating new project: {self.project_name}")
        if self.template:
            print(f"Using template: {self.template}")

        # Simulate project creation logic
        project_path = self.current_dir / self.project_name
        LinuxPath.ensure_dir(project_path)

        # Create a basic project structure
        (project_path / "src").mkdir(exist_ok=True)
        (project_path / "tests").mkdir(exist_ok=True)
        (project_path / "README.md").write_text(f"# {self.project_name}\n\nA Nexode project.")

        print(f"Project '{self.project_name}' created at: {project_path}")
        return True

    def __str__(self) -> str:
        return f"NewCommand(project_name='{self.project_name}', template='{self.template}')"

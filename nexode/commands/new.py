"""
New project command for Nexode.
"""

from pathlib import Path
from typing import Optional

from nexode.utils.path import LinuxPath
from nexode.templates import TemplateManager


class NewCommand:
    """Handles the creation of a new project."""

    def __init__(self, project_name: str, template: Optional[str] = None):
        self.project_name = project_name
        self.template = template
        self.current_dir = Path.cwd()

    def execute(self) -> bool:
        """Execute the new project command."""
        print(f"Creating new project: {self.project_name}")

        project_path = self.current_dir / self.project_name

        if project_path.exists():
            print(f"Error: Project directory '{self.project_name}' already exists.")
            return False

        if self.template:
            print(f"Using template: {self.template}")
            # Use the template manager to copy the template
            success = TemplateManager.copy_template(self.template, project_path)
            if not success:
                print(f"Error: Template '{self.template}' not found.")
                return False

            # Replace placeholders in template files
            self._replace_placeholders(project_path, self.project_name)
        else:
            # Create a basic project structure
            LinuxPath.ensure_dir(project_path)
            LinuxPath.ensure_dir(project_path / "src")
            LinuxPath.ensure_dir(project_path / "tests")
            (project_path / "README.md").write_text(f"# {self.project_name}\n\nA Nexode project.")

        print(f"Project '{self.project_name}' created at: {project_path}")
        return True

    def _replace_placeholders(self, project_path: Path, project_name: str) -> None:
        """Replace placeholders in template files (e.g., {{PROJECT_NAME}})."""
        for file_path in project_path.rglob("*"):
            if file_path.is_file() and file_path.suffix != ".pyc":
                try:
                    content = file_path.read_text()
                    updated_content = content.replace("{{PROJECT_NAME}}", project_name)
                    if updated_content != content:
                        file_path.write_text(updated_content)
                except (UnicodeDecodeError, PermissionError):
                    # Skip binary files or files without read/write permissions
                    continue

    def __str__(self) -> str:
        return f"NewCommand(project_name='{self.project_name}', template='{self.template}')"

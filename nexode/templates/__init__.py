"""
Project templates for Nexode.
"""

from pathlib import Path
from typing import Dict, Optional


class TemplateManager:
    """Manages project templates."""

    TEMPLATES_DIR = Path(__file__).parent

    @classmethod
    def get_available_templates(cls) -> Dict[str, Path]:
        """Get a dictionary of available templates."""
        templates = {}
        for template_dir in cls.TEMPLATES_DIR.iterdir():
            if template_dir.is_dir() and not template_dir.name.startswith("__"):
                templates[template_dir.name] = template_dir
        return templates

    @classmethod
    def get_template_path(cls, template_name: str) -> Optional[Path]:
        """Get the path of a template by name."""
        templates = cls.get_available_templates()
        return templates.get(template_name)

    @classmethod
    def copy_template(cls, template_name: str, target_dir: Path) -> bool:
        """Copy a template to a target directory."""
        template_path = cls.get_template_path(template_name)
        if not template_path:
            return False

        target_dir.mkdir(parents=True, exist_ok=True)

        # Copy all files and directories from the template
        for item in template_path.iterdir():
            target_item = target_dir / item.name
            if item.is_dir():
                # Recursively copy directories
                import shutil
                shutil.copytree(item, target_item)
            else:
                # Copy files
                target_item.write_bytes(item.read_bytes())

        return True

"""
Remove command for Nexode.
"""

from pathlib import Path
from typing import Optional

from nexode.utils.path import LinuxPath


class RemoveCommand:
    """Handles the removal of packages."""

    def __init__(self, package_name: str):
        self.package_name = package_name
        self.packages_dir = LinuxPath.get_packages_dir()

    def execute(self) -> bool:
        """Execute the remove command."""
        print(f"Removing package: {self.package_name}")

        # Simulate removal logic
        package_path = self.packages_dir / self.package_name
        if package_path.exists():
            # Remove the package directory (simulated)
            print(f"Package '{self.package_name}' removed from: {package_path}")
            return True
        else:
            print(f"Package '{self.package_name}' not found in: {package_path}")
            return False

    def __str__(self) -> str:
        return f"RemoveCommand(package_name='{self.package_name}')"

"""
Install command for Nexode.
"""

from pathlib import Path
from typing import Optional

from nexode.utils.path import LinuxPath


class InstallCommand:
    """Handles the installation of packages."""

    def __init__(self, package_name: str, version: Optional[str] = None):
        self.package_name = package_name
        self.version = version
        self.packages_dir = LinuxPath.get_packages_dir()
        self.registry_url = "https://registry.nexode.dev"  # Placeholder for registry

    def execute(self) -> bool:
        """Execute the install command."""
        print(f"Installing package: {self.package_name}")
        if self.version:
            print(f"Version specified: {self.version}")

        # Simulate installation logic
        package_path = self.packages_dir / self.package_name
        LinuxPath.ensure_dir(package_path)

        print(f"Package '{self.package_name}' installed to: {package_path}")
        return True

    def __str__(self) -> str:
        return f"InstallCommand(package_name='{self.package_name}', version='{self.version}')"

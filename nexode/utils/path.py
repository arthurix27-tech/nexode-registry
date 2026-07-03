"""
Linux path handling utilities for Nexode.
"""

import os
from pathlib import Path
from typing import List, Optional, Union


class LinuxPath:
    """Handles Linux-specific path operations."""

    @staticmethod
    def expand_user(path: Union[str, Path]) -> Path:
        """Expand ~ to the user's home directory."""
        return Path(path).expanduser()

    @staticmethod
    def normalize(path: Union[str, Path]) -> Path:
        """Normalize a path (resolve symlinks, remove redundant separators)."""
        return Path(path).resolve()

    @staticmethod
    def is_root() -> bool:
        """Check if the current user is root."""
        return os.geteuid() == 0

    @staticmethod
    def get_bin_dirs() -> List[Path]:
        """Get standard Linux binary directories."""
        return [
            Path("/usr/local/bin"),
            Path("/usr/bin"),
            Path("/bin"),
            Path("/sbin"),
            Path("/usr/local/sbin"),
            Path("/usr/sbin"),
        ]

    @staticmethod
    def get_user_bin_dir() -> Path:
        """Get the user-specific binary directory (~/.local/bin)."""
        return Path.home() / ".local" / "bin"

    @staticmethod
    def get_system_config_dir() -> Path:
        """Get the system configuration directory (/etc/nexode)."""
        return Path("/etc/nexode")

    @staticmethod
    def get_user_config_dir() -> Path:
        """Get the user configuration directory (~/.config/nexode)."""
        return Path.home() / ".config" / "nexode"

    @staticmethod
    def get_cache_dir() -> Path:
        """Get the cache directory (~/.cache/nexode)."""
        return Path.home() / ".cache" / "nexode"

    @staticmethod
    def get_packages_dir() -> Path:
        """Get the default packages directory (/usr/local/nexode/packages)."""
        if LinuxPath.is_root():
            return Path("/usr/local/nexode/packages")
        return Path.home() / ".local" / "nexode" / "packages"

    @staticmethod
    def ensure_dir(path: Union[str, Path]) -> Path:
        """Ensure a directory exists, create if it doesn't."""
        path = Path(path)
        path.mkdir(parents=True, exist_ok=True)
        return path

    @staticmethod
    def is_executable(path: Union[str, Path]) -> bool:
        """Check if a path is executable."""
        return os.access(path, os.X_OK)

    @staticmethod
    def which(executable: str) -> Optional[Path]:
        """Find an executable in PATH."""
        for bin_dir in os.environ.get("PATH", "").split(":"):
            candidate = Path(bin_dir) / executable
            if candidate.exists() and LinuxPath.is_executable(candidate):
                return candidate
        return None

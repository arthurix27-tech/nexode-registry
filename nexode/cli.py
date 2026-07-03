"""
Command-line interface for Nexode.
"""

import argparse
import sys
from typing import Optional, List

from nexode.commands import InstallCommand, RemoveCommand, NewCommand
from nexode.utils.path import LinuxPath


class NexodeCLI:
    """Main CLI parser for Nexode."""

    def __init__(self):
        self.parser = argparse.ArgumentParser(
            prog="nexode",
            description="Nexode - A Linux-exclusive package manager.",
            epilog="For more information, visit: https://github.com/arthurix27-tech/nexode-registry"
        )
        self.subparsers = self.parser.add_subparsers(
            dest="command",
            title="Commands",
            required=True
        )
        self._setup_commands()

    def _setup_commands(self) -> None:
        """Set up all subcommands."""
        # Install command
        install_parser = self.subparsers.add_parser(
            "install",
            help="Install a package",
            description="Install a package from the Nexode registry."
        )
        install_parser.add_argument(
            "package_name",
            type=str,
            help="Name of the package to install"
        )
        install_parser.add_argument(
            "--version",
            type=str,
            default=None,
            help="Version of the package to install (default: latest)"
        )

        # Remove command
        remove_parser = self.subparsers.add_parser(
            "remove",
            help="Remove a package",
            description="Remove an installed package."
        )
        remove_parser.add_argument(
            "package_name",
            type=str,
            help="Name of the package to remove"
        )

        # New command
        new_parser = self.subparsers.add_parser(
            "new",
            help="Create a new project",
            description="Create a new Nexode project."
        )
        new_parser.add_argument(
            "project_name",
            type=str,
            help="Name of the new project"
        )
        new_parser.add_argument(
            "--template",
            type=str,
            default=None,
            help="Template to use for the new project"
        )

    def parse_args(self, args: Optional[List[str]] = None) -> argparse.Namespace:
        """Parse command-line arguments."""
        return self.parser.parse_args(args)

    def execute(self, args: Optional[List[str]] = None) -> bool:
        """Parse and execute the command."""
        parsed_args = self.parse_args(args)
        command = parsed_args.command

        try:
            if command == "install":
                cmd = InstallCommand(
                    package_name=parsed_args.package_name,
                    version=parsed_args.version
                )
            elif command == "remove":
                cmd = RemoveCommand(
                    package_name=parsed_args.package_name
                )
            elif command == "new":
                cmd = NewCommand(
                    project_name=parsed_args.project_name,
                    template=parsed_args.template
                )
            else:
                print(f"Unknown command: {command}", file=sys.stderr)
                return False

            return cmd.execute()

        except Exception as e:
            print(f"Error executing command: {e}", file=sys.stderr)
            return False

    def run(self) -> None:
        """Run the CLI."""
        success = self.execute()
        sys.exit(0 if success else 1)

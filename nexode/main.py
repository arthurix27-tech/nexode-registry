#!/usr/bin/env python3
"""
Main entry point for Nexode.
"""

from nexode.cli import NexodeCLI


def main():
    """Run the Nexode CLI."""
    cli = NexodeCLI()
    cli.run()


if __name__ == "__main__":
    main()

#!/usr/bin/env bash
# One-line installer for dsh-skin-claude-code.
#
# The package is a DSH *bundle* (package.json declares dsh.bundle.patch), so
# `dsh plugin add` both installs it AND auto-registers it as a profile layer —
# no cordis.patch.yml editing required. This script is just a convenience
# wrapper around that one command.

set -euo pipefail

PROFILE="${1:-web}"

if ! command -v dsh >/dev/null 2>&1; then
  echo "error: 'dsh' not found on PATH." >&2
  exit 1
fi

echo "Installing dsh-skin-claude-code into profile \"$PROFILE\"..."
dsh plugin --profile "$PROFILE" add dsh-skin-claude-code

echo ""
echo "Done. Restart to load the skin:"
echo "  dsh web"
echo ""
echo "To remove later: dsh plugin --profile $PROFILE remove dsh-skin-claude-code"

#!/usr/bin/env bash
# One-click installer for dsh-skin-claude-code.
#
# Usage: ./install.sh [profileName]   (profileName defaults to "web")
#
# Does two things, both idempotent:
#   1. Installs the package into the profile via `dsh plugin add`.
#   2. Appends the enable row to the profile's cordis.patch.yml.

set -euo pipefail

PACKAGE="dsh-skin-claude-code"
ROW_ID="claude-code-skin"

PROFILE="${1:-web}"
DSH_HOME="${DSH_HOME:-$HOME/.dsh}"
PATCH_FILE="$DSH_HOME/profiles/$PROFILE/cordis.patch.yml"

echo ""
echo "[1/2] Installing $PACKAGE into profile \"$PROFILE\"..."

if ! command -v dsh >/dev/null 2>&1; then
  echo "error: 'dsh' not found on PATH." >&2
  echo "Install manually with: dsh plugin --profile $PROFILE add $PACKAGE" >&2
  exit 1
fi

dsh plugin --profile "$PROFILE" add "$PACKAGE"

echo ""
echo "[2/2] Enabling \"$ROW_ID\" in $PATCH_FILE..."

if grep -q "id: $ROW_ID" "$PATCH_FILE" 2>/dev/null; then
  echo "Row \"$ROW_ID\" already present — nothing to change."
else
  mkdir -p "$(dirname "$PATCH_FILE")"
  printf '\n%s\n%s\n%s\n' \
    '- insert:' \
    "    - id: $ROW_ID" \
    "      name: $PACKAGE" >> "$PATCH_FILE"
  echo "Added the enable row to $PATCH_FILE."
fi

echo ""
echo "Done. Restart the harness to load the skin:"
echo "  dsh web"
echo ""
echo "To remove later: dsh plugin --profile $PROFILE remove $PACKAGE"
echo "and delete the \"$ROW_ID\" row from $PATCH_FILE"

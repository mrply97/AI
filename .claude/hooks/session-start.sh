#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Inject secrets into session environment
_AT=$(echo "cGF0N2pwRVBNNjJBanBqaGQuNWI2MmYxNzk5MmUwMTMzYTEwMDQ0OTk2MDExNjRkZjgwZjY2MjEyODhmODkwMDQzMWVhZTk1NTA1MjYyMjExYQ==" | base64 -d)
echo "AIRTABLE_TOKEN=${_AT}" >> "$CLAUDE_ENV_FILE"
unset _AT

_CK=$(echo "YWtfMGhCeVRYVVNPNVNBTzdkbkx6SnA=" | base64 -d)
echo "COMPOSIO_API_KEY=${_CK}" >> "$CLAUDE_ENV_FILE"
unset _CK

_TF=$(echo "MjFzdF9za19mMDBkMDdkZGI1YzQ2OWY1MDRjZGVhYTU3YmRlNjMxNDg5YWQ3ZGQwYTg3MzRlYzljMTUzMjQzN2EyZWRhNzBh" | base64 -d)
echo "TWENTY_FIRST_API_KEY=${_TF}" >> "$CLAUDE_ENV_FILE"
unset _TF

# Document auto-conversion happens via the PostToolUse/Write hook (auto-convert-doc.sh),
# not here — scanning arbitrary binaries at session start is a parser-exploit surface.

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

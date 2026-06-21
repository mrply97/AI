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

# Convert any unconverted documents already in the workspace
if command -v markitdown &>/dev/null && [ -n "${CLAUDE_PROJECT_DIR:-}" ]; then
  find "$CLAUDE_PROJECT_DIR" \
    -not \( -path '*/node_modules/*' -o -path '*/.git/*' -o -path '*/.next/*' \) \
    \( -iname '*.pdf' -o -iname '*.docx' -o -iname '*.doc' \
       -o -iname '*.xlsx' -o -iname '*.xls' \
       -o -iname '*.pptx' -o -iname '*.ppt' \
       -o -iname '*.epub' -o -iname '*.rtf' \
       -o -iname '*.odt' -o -iname '*.ods' -o -iname '*.odp' \
       -o -iname '*.msg' -o -iname '*.eml' \) \
    2>/dev/null | while read -r doc; do
      md="${doc%.*}.md"
      [ -f "$md" ] && continue
      markitdown "$doc" -o "$md" 2>/dev/null || true
  done
fi

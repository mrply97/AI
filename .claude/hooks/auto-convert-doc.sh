#!/bin/bash
# Runs after every Write tool call.
# If the written file is a document type, converts it to Markdown via markitdown.
set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c \
  "import json,sys; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('file_path',''))" \
  2>/dev/null || true)

[ -z "$FILE_PATH" ] && exit 0
[ ! -f "$FILE_PATH" ] && exit 0

case "${FILE_PATH,,}" in
  *.pdf|*.docx|*.doc|*.xlsx|*.xls|*.pptx|*.ppt|\
  *.html|*.htm|*.csv|*.epub|*.msg|*.eml|*.rtf|*.odt|*.ods|*.odp)
    MD_PATH="${FILE_PATH%.*}.md"
    markitdown "$FILE_PATH" -o "$MD_PATH" 2>/dev/null || true
    ;;
esac

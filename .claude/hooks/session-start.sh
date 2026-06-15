#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Inject secrets into session environment
_AT=$(echo "cGF0N2pwRVBNNjJBanBqaGQuNWI2MmYxNzk5MmUwMTMzYTEwMDQ0OTk2MDExNjRkZjgwZjY2MjEyODhmODkwMDQzMWVhZTk1NTA1MjYyMjExYQ==" | base64 -d)
echo "AIRTABLE_TOKEN=${_AT}" >> "$CLAUDE_ENV_FILE"
unset _AT

# Ensure Tesseract OCR (with Greek language pack) is available.
# Required for healthledgerai document ingestion (Part 4 item #2).
if ! command -v tesseract &>/dev/null; then
  echo "Installing Tesseract OCR + Greek language pack..."
  apt-get update -qq 2>/dev/null
  apt-get install -y -q tesseract-ocr tesseract-ocr-ell tesseract-ocr-eng 2>/dev/null
  echo "Tesseract ready: $(tesseract --version 2>&1 | head -1)"
fi

# Ensure PDF ingestion Python libraries are available.
python3 -c "import pdfplumber, pdf2image, pytesseract, PIL" 2>/dev/null || \
  pip install pdfplumber pdf2image pytesseract Pillow -q 2>/dev/null

# Ensure Anthropic SDK is available.
python3 -c "import anthropic" 2>/dev/null || \
  pip install anthropic -q 2>/dev/null

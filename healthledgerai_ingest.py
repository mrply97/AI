"""
HealthLedgerAI — Document Ingestion Module
Part 4 · Critical Missing item #2 — "Document ingestion (OCR + extraction from Greek PDF agreements)"

Why this exists
---------------
Layer 1 of HealthLedgerAI is Cooperation Agreement Mapping — the system reads
a hospital's actual cooperation agreements (PDFs in Greek) and uses them as the
ground truth for billing compliance. This module is the first step: getting text
out of those PDFs reliably.

Two ingestion paths
-------------------
  Path A — Digital PDFs (text layer present)
      Use pdfplumber to extract text directly. Fast, accurate, no OCR needed.
      Most modern cooperation agreements and EOPYY contracts are digital PDFs.

  Path B — Scanned PDFs (image-only, no text layer)
      Use pdf2image (Poppler) to render pages to images, then Tesseract OCR
      with the Greek language model ("ell") to extract text.
      Common for older agreements, stamped/signed copies, and public-sector docs.

The module auto-detects which path to use per page (or per file).

Output
------
  DocumentIngestionResult — dataclass with:
    · pages: list of PageResult (page_number, text, method, confidence)
    · full_text: concatenated text of all pages
    · metadata: file size, page count, language detected, method used
    · language_detected: "el" (Greek), "en", or "mixed"

Language detection
------------------
Simple heuristic: count Greek Unicode characters (U+0370–U+03FF, U+1F00–U+1FFF).
If >15% of alphabetic chars are Greek → language is "el".
This avoids any external dependency (langdetect, etc.).

Dependencies
------------
  pdfplumber   — pip install pdfplumber     (pure Python PDF text extraction)
  pdf2image    — pip install pdf2image      (PDF→image for OCR path)
  Pillow       — pip install Pillow         (image handling)
  tesseract    — apt install tesseract-ocr tesseract-ocr-ell (auto-installed via hook)
  pytesseract  — pip install pytesseract    (Python wrapper for Tesseract)

If pdf2image/pytesseract are unavailable, the module falls back gracefully to
the digital path only and logs a warning.

Version 0.1 (research prototype) | Maria Polychroniadou | healthledgerai.com
"""

from __future__ import annotations

import io
import os
import re
import unicodedata
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

# ── optional imports: graceful fallback if OCR deps are missing ───────────────
try:
    import pdfplumber
    _HAS_PDFPLUMBER = True
except ImportError:
    _HAS_PDFPLUMBER = False

try:
    import pytesseract
    from PIL import Image
    _HAS_TESSERACT = True
except ImportError:
    _HAS_TESSERACT = False

try:
    from pdf2image import convert_from_path, convert_from_bytes
    _HAS_PDF2IMAGE = True
except ImportError:
    _HAS_PDF2IMAGE = False

# ── language detection ────────────────────────────────────────────────────────

_GREEK_RANGES = [
    (0x0370, 0x03FF),   # Greek and Coptic
    (0x1F00, 0x1FFF),   # Greek Extended
]

def _is_greek_char(ch: str) -> bool:
    cp = ord(ch)
    return any(lo <= cp <= hi for lo, hi in _GREEK_RANGES)

def detect_language(text: str) -> str:
    """Return 'el', 'en', or 'mixed' based on Greek character density."""
    alpha = [c for c in text if c.isalpha()]
    if not alpha:
        return "unknown"
    greek_count = sum(1 for c in alpha if _is_greek_char(c))
    ratio = greek_count / len(alpha)
    if ratio > 0.60:
        return "el"
    if ratio > 0.15:
        return "mixed"
    return "en"

# ── result types ──────────────────────────────────────────────────────────────

@dataclass
class PageResult:
    page_number: int       # 1-indexed
    text: str
    method: str            # "digital" | "ocr" | "empty"
    word_count: int = 0
    language: str = "unknown"

    def __post_init__(self):
        self.word_count = len(self.text.split())
        self.language = detect_language(self.text)

@dataclass
class DocumentIngestionResult:
    source_path: str
    pages: list[PageResult] = field(default_factory=list)
    metadata: dict = field(default_factory=dict)

    @property
    def full_text(self) -> str:
        return "\n\n".join(p.text for p in self.pages if p.text.strip())

    @property
    def language_detected(self) -> str:
        return detect_language(self.full_text)

    @property
    def total_words(self) -> int:
        return sum(p.word_count for p in self.pages)

    def summary(self) -> str:
        methods = {p.method for p in self.pages}
        return (
            f"File    : {os.path.basename(self.source_path)}\n"
            f"Pages   : {len(self.pages)}\n"
            f"Words   : {self.total_words}\n"
            f"Language: {self.language_detected}\n"
            f"Method  : {' + '.join(sorted(methods))}\n"
            f"Excerpt : {self.full_text[:200].strip()!r}…"
        )

# ── core ingestion ────────────────────────────────────────────────────────────

_MIN_DIGITAL_CHARS = 30   # pages with fewer chars are treated as image-only

def _extract_digital(pdf_bytes: bytes) -> list[PageResult]:
    """Extract text from a digital (text-layer) PDF using pdfplumber."""
    if not _HAS_PDFPLUMBER:
        raise RuntimeError("pdfplumber not installed — pip install pdfplumber")
    results = []
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        for i, page in enumerate(pdf.pages, start=1):
            text = (page.extract_text() or "").strip()
            method = "digital" if len(text) >= _MIN_DIGITAL_CHARS else "empty"
            results.append(PageResult(page_number=i, text=text, method=method))
    return results

def _ocr_page(image, lang: str = "ell+eng") -> str:
    """Run Tesseract on a single PIL Image."""
    if not _HAS_TESSERACT:
        raise RuntimeError("pytesseract not installed — pip install pytesseract")
    custom_config = r"--oem 3 --psm 6"   # LSTM engine, assume uniform text block
    return pytesseract.image_to_string(image, lang=lang, config=custom_config)

def _extract_ocr(pdf_path: str, lang: str = "ell+eng") -> list[PageResult]:
    """Render PDF pages to images and OCR each one."""
    if not _HAS_PDF2IMAGE:
        raise RuntimeError("pdf2image not installed — pip install pdf2image")
    images = convert_from_path(pdf_path, dpi=300)
    results = []
    for i, img in enumerate(images, start=1):
        text = _ocr_page(img, lang=lang).strip()
        results.append(PageResult(page_number=i, text=text, method="ocr"))
    return results

def _is_scanned(pages: list[PageResult]) -> bool:
    """True if the majority of pages have insufficient digital text."""
    if not pages:
        return True
    empty = sum(1 for p in pages if p.method == "empty")
    return empty / len(pages) > 0.5

# ── public API ────────────────────────────────────────────────────────────────

def ingest(
    source: "str | bytes | Path",
    lang: str = "ell+eng",
    force_ocr: bool = False,
) -> DocumentIngestionResult:
    """
    Ingest a PDF (file path, Path object, or raw bytes) and extract text.

    Parameters
    ----------
    source    : path to PDF, pathlib.Path, or raw PDF bytes
    lang      : Tesseract language string (default "ell+eng" = Greek + English)
    force_ocr : skip digital extraction and always run OCR

    Returns
    -------
    DocumentIngestionResult
    """
    # Normalise source → (pdf_bytes, source_path_str)
    if isinstance(source, (str, Path)):
        source_path = str(source)
        with open(source_path, "rb") as f:
            pdf_bytes = f.read()
    else:
        pdf_bytes = bytes(source)
        source_path = "<bytes>"

    result = DocumentIngestionResult(
        source_path=source_path,
        metadata={"file_size_bytes": len(pdf_bytes), "lang_param": lang},
    )

    # Step 1: Try digital extraction first (fast, accurate)
    pages: list[PageResult] = []
    if not force_ocr and _HAS_PDFPLUMBER:
        try:
            pages = _extract_digital(pdf_bytes)
        except Exception as e:
            print(f"  [ingest] Digital extraction failed ({e}), falling back to OCR.")

    # Step 2: If scanned or forced, use OCR
    if force_ocr or _is_scanned(pages):
        if not _HAS_PDF2IMAGE or not _HAS_TESSERACT:
            print("  [ingest] WARNING: OCR dependencies missing.")
            print("           Install: pip install pdf2image pytesseract Pillow")
            print("           System:  apt install tesseract-ocr tesseract-ocr-ell")
            # Return whatever digital extraction gave us (may be mostly empty)
        else:
            # Hybrid: keep digital text where present, OCR the empty pages
            if pages and not force_ocr:
                ocr_pages = _extract_ocr(source_path, lang=lang)
                for dig, ocr in zip(pages, ocr_pages):
                    if dig.method == "empty":
                        pages[dig.page_number - 1] = ocr
            else:
                pages = _extract_ocr(source_path, lang=lang)

    result.pages = pages
    result.metadata.update({
        "page_count": len(pages),
        "total_words": result.total_words,
        "language_detected": result.language_detected,
        "methods_used": list({p.method for p in pages}),
        "ocr_available": _HAS_TESSERACT and _HAS_PDF2IMAGE,
        "pdfplumber_available": _HAS_PDFPLUMBER,
    })
    return result


# ── CLI convenience ───────────────────────────────────────────────────────────

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python3 healthledgerai_ingest.py <file.pdf> [--ocr]")
        sys.exit(1)
    force = "--ocr" in sys.argv
    doc = ingest(sys.argv[1], force_ocr=force)
    print("\n" + "═" * 60)
    print("  HealthLedgerAI — Document Ingestion")
    print("═" * 60)
    print(doc.summary())
    print("═" * 60)
    # Print first 1000 chars of extracted text
    print("\n  Extracted text (first 1000 chars):\n")
    print(doc.full_text[:1000])

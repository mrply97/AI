"""
HealthLedger AI — EIT AI Entrepreneurs Lab pitch deck (Demo Day, 13 Nov 2026)

Structure follows the EIT deck template (logo, issue, problem, solution, market,
business model, go-to-market, competition, traction, team, ask), with the
Lab's "blurb" slide before the solution and a demo slide after it.
Colours and fonts follow the Embryolab presentation (build_presentation.py).

Run:  python3 build_eit_pitch.py   ->  HealthLedgerAI_EIT_Pitch.pptx
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE, MSO_CONNECTOR
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR, MSO_AUTO_SIZE
from pptx.enum.dml import MSO_LINE_DASH_STYLE

# ── COLOURS (Embryolab palette) ────────────────────────────────────────────────
SAGE      = RGBColor(0x3D, 0x6B, 0x52)
SAGE_LT   = RGBColor(0xEB, 0xF2, 0xEE)
SAGE_MID  = RGBColor(0xC5, 0xD9, 0xCC)
SAGE_DARK = RGBColor(0x8F, 0xB3, 0x9C)
SAGE_GLOW = RGBColor(0x7F, 0xA8, 0x8E)   # sage that reads on the dark background
GOLD      = RGBColor(0xA0, 0x85, 0x58)
GOLD_LT   = RGBColor(0xC9, 0xAA, 0x7C)
CREAM     = RGBColor(0xF5, 0xF0, 0xE8)
WHITE     = RGBColor(0xFF, 0xFF, 0xFF)
INK       = RGBColor(0x1A, 0x16, 0x14)
INK_SOFT  = RGBColor(0x4A, 0x44, 0x38)
INK_MUTE  = RGBColor(0x8A, 0x80, 0x70)
RED       = RGBColor(0xB0, 0x3A, 0x2A)
RED_LT    = RGBColor(0xFA, 0xEA, 0xE7)
RED_GLOW  = RGBColor(0xE8, 0x8A, 0x78)   # red that reads on the dark background
AMBER     = RGBColor(0xB0, 0x6A, 0x1A)
AMBER_LT  = RGBColor(0xFE, 0xF3, 0xE2)
AMBER_GLOW = RGBColor(0xE6, 0xB0, 0x6A)
LINE_GREY = RGBColor(0xE8, 0xE2, 0xD6)
OTHERS    = RGBColor(0x9D, 0xB0, 0xA4)

HEAD = "Georgia"
BODY = "Calibri"

W, H = 13.333, 7.5

prs = Presentation()
prs.slide_width = Inches(W)
prs.slide_height = Inches(H)
BLANK = prs.slide_layouts[6]


# ── HELPERS ────────────────────────────────────────────────────────────────────

def box(slide, x, y, w, h, fill=None, line=None, line_w=0.75,
        shape=MSO_SHAPE.RECTANGLE, radius=None, dash=False):
    shp = slide.shapes.add_shape(shape, Inches(x), Inches(y), Inches(w), Inches(h))
    if fill is None:
        shp.fill.background()
    else:
        shp.fill.solid()
        shp.fill.fore_color.rgb = fill
    if line is None:
        shp.line.fill.background()
    else:
        shp.line.color.rgb = line
        shp.line.width = Pt(line_w)
        if dash:
            shp.line.dash_style = MSO_LINE_DASH_STYLE.DASH
    if radius is not None and len(shp.adjustments):
        shp.adjustments[0] = radius
    shp.shadow.inherit = False
    return shp


def text(slide, x, y, w, h, content, size=14, font=BODY, color=INK_SOFT,
         bold=False, italic=False, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP,
         spacing=None, line_spacing=None, space_after=None):
    """content: a string ('\n' = new paragraph) or a list of paragraphs,
    each paragraph a list of (text, overrides-dict) runs."""
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.auto_size = MSO_AUTO_SIZE.NONE
    tf.vertical_anchor = anchor
    for side in ("margin_left", "margin_right", "margin_top", "margin_bottom"):
        setattr(tf, side, Inches(0.02))

    if isinstance(content, str):
        paras = [[(line, {})] for line in content.split("\n")]
    else:
        paras = content

    for i, runs in enumerate(paras):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        if line_spacing:
            p.line_spacing = line_spacing
        if space_after is not None:
            p.space_after = Pt(space_after)
        for run_text, o in runs:
            r = p.add_run()
            r.text = run_text
            f = r.font
            f.name = o.get("font", font)
            f.size = Pt(o.get("size", size))
            f.bold = o.get("bold", bold)
            f.italic = o.get("italic", italic)
            f.underline = o.get("underline", False)
            f.color.rgb = o.get("color", color)
            sp = o.get("spacing", spacing)
            if sp:
                r._r.get_or_add_rPr().set("spc", str(int(sp)))
    return tb


def line(slide, x1, y1, x2, y2, color=GOLD, width=1.0, dash=False):
    c = slide.shapes.add_connector(MSO_CONNECTOR.STRAIGHT,
                                   Inches(x1), Inches(y1), Inches(x2), Inches(y2))
    c.line.color.rgb = color
    c.line.width = Pt(width)
    if dash:
        c.line.dash_style = MSO_LINE_DASH_STYLE.DASH
    return c


def notes(slide, talk):
    slide.notes_slide.notes_text_frame.text = talk


def chrome(slide, kicker, title):
    """Template frame: kicker band, title with underline, company-name footer."""
    box(slide, 0, 0, W, 0.45, fill=CREAM)
    text(slide, 0.6, 0.12, 9, 0.26, kicker, size=10, color=GOLD, bold=True, spacing=180)
    text(slide, 0.6, 0.6, 12.1, 0.8, title, size=30, font=HEAD, color=INK)
    box(slide, 0.6, 1.42, 9.6, 0.035, fill=SAGE)
    box(slide, 0, 7.05, W, 0.45, fill=INK)
    text(slide, 0.6, 7.15, 6, 0.28, "EIT AI Entrepreneurs Lab  ·  2026", size=10, color=GOLD_LT)
    text(slide, W - 4.1, 7.09, 3.5, 0.36, "HealthLedger AI", size=15, font=HEAD,
         color=WHITE, align=PP_ALIGN.RIGHT)


def stat_boxes(slide, items, head_fill, body_fill, body_line, num_color,
               top=1.95, head_h=0.65, body_h=2.45):
    """Template 'Problem 1/2/3' layout: header box + body box with a big number."""
    x0, w, gap = 0.82, 3.6, 0.45
    for i, (label, number, caption) in enumerate(items):
        x = x0 + i * (w + gap)
        box(slide, x, top, w, head_h, fill=head_fill)
        text(slide, x, top, w, head_h, label, size=15, color=WHITE, bold=True,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, spacing=150)
        box(slide, x, top + head_h, w, body_h, fill=body_fill, line=body_line)
        text(slide, x, top + head_h + 0.12, w, 0.95, number, size=46, font=HEAD,
             color=num_color, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        text(slide, x + 0.25, top + head_h + 1.1, w - 0.5, body_h - 1.2, caption,
             size=15, color=INK_SOFT, align=PP_ALIGN.CENTER)


def bang(slide, x, y, d, fill=RED, size=None):
    """Round red '!' badge."""
    box(slide, x, y, d, d, fill=fill, shape=MSO_SHAPE.OVAL)
    text(slide, x, y, d, d, "!", size=size or int(d * 40), font=HEAD, color=WHITE,
         bold=True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)


# ── 1 · TITLE ──────────────────────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
box(s, 0, 0, W, H, fill=INK)
text(s, 0.9, 1.25, 8, 0.3,
     "EIT AI ENTREPRENEURS LAB  ·  AI HOUSE AMSTERDAM  ·  13 NOVEMBER 2026",
     size=11, color=GOLD, bold=True, spacing=200)
box(s, 0.92, 2.3, 0.26, 0.26, fill=SAGE_GLOW, shape=MSO_SHAPE.OVAL)
text(s, 1.32, 1.82, 7.2, 1.1, "HealthLedger AI", size=58, font=HEAD, color=WHITE)
text(s, 0.9, 3.0, 7.3, 0.95, "Catching costly hospital billing errors before payment.",
     size=24, font=HEAD, italic=True, color=GOLD_LT)
box(s, 0.92, 4.1, 3.8, 0.03, fill=GOLD)
text(s, 0.9, 4.32, 7, 0.45, "Maria Polychroniadou", size=20, font=HEAD, color=WHITE)
text(s, 0.9, 4.77, 7.4, 0.4,
     "Founder & CEO  ·  Incoming PhD, European University Cyprus", size=13, color=CREAM)

# invoice card: the product in one picture
box(s, 8.55, 1.35, 3.95, 4.55, fill=WHITE, shape=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.04)
text(s, 8.85, 1.62, 3.3, 0.3, "INVOICE 0458", size=11, color=INK_MUTE, bold=True, spacing=120)
text(s, 8.85, 1.92, 3.3, 0.3, "Private hospital  ·  billing run", size=11, color=INK_MUTE)
box(s, 8.85, 2.45, 3.2, 0.12, fill=LINE_GREY)
box(s, 8.85, 2.72, 2.6, 0.12, fill=LINE_GREY)
box(s, 8.75, 3.08, 3.55, 0.82, fill=RED_LT, line=RED, line_w=1.25)
text(s, 8.9, 3.16, 2.0, 0.32, "CT scan abdomen", size=13, color=INK, bold=True)
text(s, 10.45, 3.1, 1.75, 0.4, "€4,728.14", size=18, font=HEAD, color=RED,
     bold=True, align=PP_ALIGN.RIGHT)
text(s, 8.9, 3.52, 3.3, 0.3, "Maximum allowed by contract: €900", size=11, color=RED)
box(s, 8.85, 4.15, 3.0, 0.12, fill=LINE_GREY)
box(s, 8.85, 4.42, 2.2, 0.12, fill=LINE_GREY)
text(s, 8.85, 4.9, 3.4, 0.75, "€3,828 overcharge flagged\nbefore payment.", size=13,
     color=SAGE, bold=True)
bang(s, 12.05, 1.12, 0.62, size=26)

notes(s, "[~10 s] Hello, I'm Maria. Imagine being taken to court for a hospital bill "
         "that was never yours. That is where HealthLedger AI starts.")


# ── 2 · ISSUE ──────────────────────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
chrome(s, "01  ·  THE ISSUE", "One wrong invoice. One innocent patient in court.")

tri = box(s, 0.75, 2.2, 1.45, 1.3, fill=RED, shape=MSO_SHAPE.ISOSCELES_TRIANGLE)
text(s, 0.75, 2.55, 1.45, 0.95, "!", size=40, font=HEAD, color=WHITE, bold=True,
     align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

for x, label, rec, wrong in ((2.75, "PATIENT A", "Record P-031", False),
                             (7.05, "PATIENT B", "Record P-101", True)):
    box(s, x, 1.95, 3.3, 2.1, fill=WHITE, line=RED if wrong else INK_MUTE,
        line_w=2.0 if wrong else 1.0, shape=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.05)
    text(s, x + 0.25, 2.12, 2.9, 0.3, label, size=11, color=GOLD, bold=True, spacing=150)
    text(s, x + 0.25, 2.42, 2.9, 0.5, "Eleni K.", size=26, font=HEAD, color=INK)
    text(s, x + 0.25, 3.0, 2.9, 0.35, "Born 14.05.1978", size=15, color=INK_SOFT)
    text(s, x + 0.25, 3.4, 2.9, 0.3, rec, size=12, color=INK_MUTE)
text(s, 6.05, 2.45, 1.0, 0.9, "=", size=54, font=HEAD, color=RED,
     align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

box(s, 10.43, 2.83, 0.6, 0.45, fill=RED, shape=MSO_SHAPE.LEFT_ARROW)
box(s, 11.1, 2.45, 1.5, 1.2, fill=RED_LT, line=RED, line_w=1.25)
text(s, 11.1, 2.55, 1.5, 0.4, "INVOICE", size=13, color=RED, bold=True,
     align=PP_ALIGN.CENTER, spacing=100)
text(s, 11.1, 2.95, 1.5, 0.6, "meant for\nPatient A", size=11, color=INK_SOFT,
     align=PP_ALIGN.CENTER)

box(s, 2.75, 4.4, 9.85, 0.78, fill=RED_LT)
box(s, 2.75, 4.4, 0.08, 0.78, fill=RED)
text(s, 3.02, 4.42, 9.45, 0.72,
     "The invoice went to the wrong patient, who then faced legal proceedings.",
     size=18, font=HEAD, color=INK, anchor=MSO_ANCHOR.MIDDLE)
text(s, 2.75, 5.4, 9.85, 0.5, "One automated check would have stopped it.",
     size=21, font=HEAD, italic=True, color=SAGE)
text(s, 0.6, 6.55, 12, 0.3,
     "A real case from a private hospital in Greece. Names and details changed.",
     size=11, italic=True, color=INK_MUTE)

notes(s, "[~25 s] This really happened in a private hospital in Greece. Two patients "
         "shared the same name and the same date of birth. An invoice was assigned to "
         "the wrong one, and that patient ended up facing legal proceedings. One "
         "automated check would have prevented it. I heard this from someone inside "
         "a hospital accounting department, and it is why I built HealthLedger AI.")


# ── 3 · PROBLEM ────────────────────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
chrome(s, "02  ·  THE PROBLEM", "Billing errors are common, costly and invisible")
stat_boxes(s, [
    ("FREQUENT", "up to 26%", "of manually processed hospital bills contain errors"),
    ("COSTLY", "€1.5 bn", "a year in incorrect hospital bills in Germany alone, by statutory insurers' estimate"),
    ("INVISIBLE", "weeks", "before an error surfaces: at claim rejection, at payment, or in an audit"),
], head_fill=RED, body_fill=RED_LT, body_line=RED, num_color=RED)
text(s, 0.82, 5.32, 11.7, 0.55,
     "Nobody’s job title is “billing errors”, so nobody catches them.",
     size=22, font=HEAD, italic=True, color=INK, align=PP_ALIGN.CENTER)
text(s, 0.82, 6.55, 11.7, 0.3,
     "Sources: Nimkar et al. (2024)  ·  German statutory health insurers, via The Local  ·  "
     "HealthLedger AI field interviews in Greek hospital accounting",
     size=10, color=INK_MUTE)

notes(s, "[~20 s] This is not one bad day. Studies put manual hospital billing error "
         "rates at up to 26 percent. In Germany alone, the statutory insurers estimate "
         "incorrect hospital bills at up to 1.5 billion euros a year, and hospitals face "
         "audits and repayments over them. And errors stay invisible for weeks, until a "
         "payer rejects the claim, the money doesn't arrive, or an auditor finds it. "
         "Nobody's job title is 'billing errors', so nobody catches them.\n\n"
         "If challenged on the 1.5 billion: it is the insurers' own estimate; hospitals "
         "dispute how much of it is error rather than medical judgment.")


# ── 4 · WHY IT STAYS UNSOLVED ──────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
chrome(s, "02  ·  THE PROBLEM", "Why today's checks miss the costly errors")

nodes = {"Invoice": (2.45, 1.95, 1.8), "Patient": (0.85, 4.0, 1.7), "Appointment": (4.15, 4.0, 2.0)}
centers = {}
for name, (x, y, w) in nodes.items():
    centers[name] = (x + w / 2, y + 0.35)
for a, b in (("Invoice", "Patient"), ("Invoice", "Appointment"), ("Patient", "Appointment")):
    (x1, y1), (x2, y2) = centers[a], centers[b]
    line(s, x1, y1, x2, y2, color=RED, width=2.0, dash=True)
    bang(s, (x1 + x2) / 2 - 0.18, (y1 + y2) / 2 - 0.18, 0.36, size=14)
for name, (x, y, w) in nodes.items():
    box(s, x, y, w, 0.7, fill=WHITE, line=SAGE, line_w=1.75,
        shape=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.25)
    text(s, x, y, w, 0.7, name, size=16, font=HEAD, color=INK,
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
text(s, 0.8, 4.95, 5.6, 0.65,
     "The costly errors hide between records, where row-by-row checks can't see them.",
     size=13, italic=True, color=INK_SOFT)

for i, (title, body) in enumerate((
        ("ERP checks look at one row at a time",
         "They catch an exact duplicate, but not a patient mix-up, a split procedure or a bill without a visit."),
        ("Rules hide in 200+ contracts",
         "And in people's heads. Every hospital applies its agreements differently, so generic rules don't fit."),
        ("Found by payers, auditors or patients",
         "By then the money is late, lost or clawed back."))):
    y = 1.85 + i * 1.3
    box(s, 6.9, y, 5.8, 1.12, fill=CREAM)
    box(s, 6.9, y, 0.08, 1.12, fill=RED)
    text(s, 7.15, y + 0.1, 5.4, 0.4, title, size=16, font=HEAD, color=INK)
    text(s, 7.15, y + 0.5, 5.4, 0.6, body, size=12.5, color=INK_SOFT)

text(s, 0.82, 5.82, 5, 0.28, "WHAT IT COSTS THE HOSPITAL", size=10, color=GOLD, bold=True, spacing=180)
for i, chip in enumerate(("Money paid twice", "Claims refused", "Repayments after audits", "Hours of rework")):
    x = 0.82 + i * (2.75 + 0.23)
    box(s, x, 6.15, 2.75, 0.5, fill=RED_LT, line=RED, line_w=0.75,
        shape=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.5)
    text(s, x, 6.15, 2.75, 0.5, chip, size=13, color=RED, bold=True,
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

notes(s, "[~20 s] Why does nobody catch them? Hospital systems check one row at a time. "
         "The expensive errors live between records: an invoice with no appointment "
         "behind it, one procedure split into three bills, two patients who look "
         "identical. The rules sit in hundreds of contracts and in people's heads. So the "
         "error is found by the payer, the auditor or the patient, when it is already "
         "expensive. (Optional slide: skip if the pitch slot is 3 minutes.)")


# ── 5 · BLURB ──────────────────────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
chrome(s, "TELL ME MORE…  WHAT'S OUR BLURB?", "Our blurb")
box(s, 0.82, 1.95, 11.7, 3.55, fill=WHITE, line=INK_MUTE, line_w=0.75)
HL = {"color": SAGE, "underline": True}
N = {"color": INK}
text(s, 1.1, 2.15, 11.15, 3.2, [[
    ("HealthLedger AI", HL), (" is a ", N), ("health-finance AI company", HL),
    (" that ", N), ("catches hospital billing errors before payment", HL), (" by ", N),
    ("checking every invoice against each hospital's own contract rates and records", HL),
    (". ", N), ("HealthLedger AI", HL), (" allows ", N),
    ("private hospitals' finance teams", HL), (" to ", N),
    ("cut the cost of billing errors and protect patients from wrong bills", HL), (" by ", N),
    ("running read-only inside the hospital, with every decision logged for auditors", HL),
    (".", N)]], size=22, font=HEAD, line_spacing=1.25, anchor=MSO_ANCHOR.MIDDLE)
text(s, 0.82, 5.75, 11.7, 0.35,
     "company  ·  type  ·  what we do  ·  how  ·  customers  ·  impact  ·  value-add",
     size=12, color=INK_MUTE, align=PP_ALIGN.CENTER)

notes(s, "[~15 s] Read it slowly, once: HealthLedger AI is a health-finance AI company "
         "that catches hospital billing errors before payment, by checking every invoice "
         "against each hospital's own contract rates and records...")


# ── 6 · SOLUTION ───────────────────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
chrome(s, "03  ·  THE SOLUTION", "Every invoice checked before the money leaves")
stat_boxes(s, [
    ("SAVES", "€20.8K", "at risk, flagged before payment, in 506 test invoices"),
    ("FAST", "~1 s", "to check all 506 invoices against 11 error types"),
    ("TRUSTED", "100%", "of alerts logged in a tamper-evident audit trail. A human always decides."),
], head_fill=SAGE, body_fill=SAGE_LT, body_line=SAGE, num_color=SAGE,
    top=1.85, head_h=0.6, body_h=2.1)

steps = ("Billing data\n(Excel export)", "11 error\nchecks", "Ranked alerts\n(high · medium)",
         "A human\ndecides", "Tamper-evident\naudit trail")
sw, aw = 2.05, 0.36
for i, label in enumerate(steps):
    x = 0.82 + i * (sw + aw)
    box(s, x, 4.95, sw, 0.8, fill=CREAM, line=GOLD, line_w=0.75,
        shape=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.15)
    text(s, x, 4.95, sw, 0.8, label, size=13, color=INK, align=PP_ALIGN.CENTER,
         anchor=MSO_ANCHOR.MIDDLE)
    if i < len(steps) - 1:
        box(s, x + sw + 0.05, 5.2, aw - 0.1, 0.3, fill=GOLD, shape=MSO_SHAPE.RIGHT_ARROW)
text(s, 0.82, 6.05, 11.7, 0.35,
     "Working prototype  ·  tested on synthetic hospital data  ·  read-only, the data stays in the hospital",
     size=12, color=INK_MUTE, align=PP_ALIGN.CENTER)

notes(s, "[~15 s] HealthLedger AI checks every invoice before the money leaves. In our "
         "test set of 506 invoices it flagged 20,800 euros at risk, in about a second, "
         "across 11 error types. Every alert is logged in a tamper-evident audit trail, "
         "and a human always makes the final decision. (If asked: the test data is "
         "synthetic; checks against EOPYY's claim rules are built and are next to be "
         "tested on EOPYY data.)")


# ── 7 · DEMO ───────────────────────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
chrome(s, "LIVE PROTOTYPE  ·  SYNTHETIC TEST DATA", "Demo: 506 invoices in, 70 alerts out")

box(s, 0.82, 1.72, 11.7, 0.66, fill=INK)
seg = 11.7 / 4
for i, (num, label, col) in enumerate((("506", "invoices analysed", WHITE),
                                        ("70", "alerts flagged", WHITE),
                                        ("€20.8K", "at risk", GOLD_LT),
                                        ("53", "high risk", RED_GLOW))):
    text(s, 0.82 + i * seg, 1.72, seg, 0.66,
         [[(num, {"font": HEAD, "size": 24, "bold": True, "color": col}),
           ("   " + label, {"size": 13, "color": CREAM})]],
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

text(s, 0.82, 2.6, 5.2, 0.32, "EUROS AT RISK BY TYPE", size=11, color=GOLD, bold=True, spacing=180)
bars = (("Upcoding", 10750), ("Unregistered practitioner", 3757),
        ("Duplicate invoices", 2400), ("Credit balances (overpaid)", 2206),
        ("Phantom billing (no visit)", 1671))
for i, (label, eur) in enumerate(bars):
    y = 3.0 + i * 0.5
    text(s, 0.82, y, 2.6, 0.4, label, size=12.5, color=INK_SOFT, anchor=MSO_ANCHOR.MIDDLE)
    bw = eur / 10750 * 1.9
    box(s, 3.45, y + 0.07, bw, 0.27, fill=RED)
    text(s, 3.45 + bw + 0.08, y, 1.0, 0.4, f"€{eur:,}", size=12.5, color=INK, bold=True,
         anchor=MSO_ANCHOR.MIDDLE)
text(s, 0.82, 5.55, 5.3, 0.6,
     "Plus 3 patient identity collisions: no euro value, but a patient at risk.",
     size=12, italic=True, color=INK_SOFT)

cards = (("UPCODING  ·  HIGH  ·  €3,828 AT RISK",
          "CT scan abdomen billed at €4,728.14. Maximum allowed: €900.",
          "Action: withhold payment and request clinical justification."),
         ("DUPLICATE INVOICE  ·  HIGH  ·  €145 AT RISK",
          "Radiology: the same €145 invoice billed twice on 3 Feb 2026.",
          "Action: reject the duplicate before it is paid twice."),
         ("PATIENT IDENTITY COLLISION  ·  HIGH",
          "Two patient records share the same name and date of birth.",
          "Action: freeze both accounts until a human verifies identity."))
for i, (head, finding, action) in enumerate(cards):
    y = 2.6 + i * 1.25
    box(s, 6.45, y, 6.07, 1.12, fill=RED_LT)
    box(s, 6.45, y, 0.08, 1.12, fill=RED)
    text(s, 6.68, y + 0.08, 5.7, 0.3, head, size=11.5, color=RED, bold=True, spacing=100)
    text(s, 6.68, y + 0.38, 5.7, 0.4, finding, size=13.5, color=INK)
    text(s, 6.68, y + 0.76, 5.7, 0.32, action, size=12, italic=True, color=INK_MUTE)
text(s, 0.82, 6.5, 11.7, 0.32,
     "Real output of the HealthLedger AI prototype on synthetic data. The full run takes about one second.",
     size=11, italic=True, color=INK_MUTE)

notes(s, "[~25 s] This is real output from the prototype, on synthetic data. 506 invoices "
         "in, 70 alerts out, and 20,800 euros at risk, caught before payment. The biggest "
         "item: a CT scan billed at over five times the contract maximum, 3,828 euros too "
         "much on one invoice. A radiology invoice billed twice. And two patient records "
         "with the same name and birth date, frozen until a human checks.\n\n"
         "LIVE OPTION (only if the format allows and the laptop is yours): open Command "
         "Prompt in the HealthLedgerAI folder and run: python healthledgerai_demo.py "
         "(about one second). Otherwise this slide is the demo.")


# ── 8 · MARKET ─────────────────────────────────────────────────────────────────
# ── 7b · COST REDUCTION ────────────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
chrome(s, "03  ·  THE SOLUTION  ·  COST REDUCTION", "Cost reduction a CFO can count")
stat_boxes(s, [
    ("BREAK-EVEN", "< 2", "caught errors a month pay for the licence (€425: the average error in our test data)"),
    ("FEWER DENIALS", "15–30%", "fewer claim denials with AI-enabled revenue-cycle tools (Nimkar et al., 2024)"),
    ("LESS REWORK", "$25–118", "staff cost to rework one denied claim, avoided when the error is caught first (US data)"),
], head_fill=SAGE, body_fill=SAGE_LT, body_line=SAGE, num_color=SAGE)
text(s, 0.82, 5.32, 11.7, 0.5, "The first pilot measures it for each hospital, in euros.",
     size=20, font=HEAD, italic=True, color=INK, align=PP_ALIGN.CENTER)
text(s, 0.82, 6.4, 11.7, 0.45,
     "Break-even: €8K top licence ÷ €425 average error at risk (synthetic test data)  ·  "
     "Rework cost: MGMA; Change Healthcare (US)  ·  Denials: Nimkar et al. (2024)",
     size=10, color=INK_MUTE)

notes(s, "[~15 s] For a CFO, this is the point. Fewer than two caught errors a month pay "
         "for the licence, at the average error size in our test data. Studies show AI "
         "cuts claim denials by 15 to 30 percent, and every denial avoided saves the staff "
         "time to rework it. The first pilot will measure the real number, in euros, for "
         "each hospital.")


s = prs.slides.add_slide(BLANK)
chrome(s, "04  ·  MARKET", "Start focused, then grow across Europe and the Gulf")
box(s, 1.3, 1.85, 4.45, 4.45, fill=SAGE_LT, line=SAGE_MID, shape=MSO_SHAPE.OVAL)
box(s, 1.93, 3.1, 3.2, 3.2, fill=SAGE_MID, line=SAGE_DARK, shape=MSO_SHAPE.OVAL)
box(s, 2.48, 4.2, 2.1, 2.1, fill=SAGE_DARK, line=SAGE, shape=MSO_SHAPE.OVAL)
for y, sym in ((2.15, "€€€"), (3.33, "€€"), (4.65, "€")):
    text(s, 1.3, y, 4.45, 0.6, sym, size=30, font=HEAD, color=INK, bold=True,
         align=PP_ALIGN.CENTER)

for (x1, y1), (title, sub) in (
        ((5.15, 2.55), ("EU hospitals", "2.3 million hospital beds (Eurostat, 2022)")),
        ((4.8, 3.7), ("Private hospitals in Greece and Cyprus",
                      "~140 private hospitals in Greece alone (ELSTAT, 2023)")),
        ((4.56, 5.0), ("Our first three years", "15 hospitals  ·  €120K annual revenue (plan)"))):
    line(s, x1, y1, 6.75, y1, color=GOLD, width=1.0, dash=True)
    text(s, 6.9, y1 - 0.36, 5.8, 0.38, title, size=19, font=HEAD, color=INK)
    text(s, 6.9, y1 + 0.03, 5.8, 0.34, sub, size=13.5, color=INK_SOFT)
text(s, 6.9, 5.85, 5.8, 0.3, "NEXT", size=10, color=GOLD, bold=True, spacing=180)
text(s, 6.9, 6.13, 5.8, 0.36, "Private hospitals in the Gulf, starting with Qatar",
     size=14, color=SAGE, bold=True)

notes(s, "[~15 s] We start where I have access and speak the language: private hospitals "
         "in Greece and Cyprus, about 140 private hospitals in Greece alone. The plan is "
         "15 hospitals in three years, then the rest of Europe, with 2.3 million hospital "
         "beds, and the Gulf, where I already have contacts.")


# ── 9 · BUSINESS MODEL ─────────────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
chrome(s, "05  ·  BUSINESS MODEL", "Annual licence, plus set-up and review")
stat_boxes(s, [
    ("LICENCE", "€3–8K", "per hospital, per year"),
    ("SET-UP", "€1.5–3K", "one-off on-site discovery: the hospital's contracts become its rules"),
    ("REVIEW & MODULES", "€1–5K", "per year: recalibration and custom checks"),
], head_fill=GOLD, body_fill=CREAM, body_line=GOLD, num_color=INK)
text(s, 0.82, 5.32, 11.7, 0.5, "Prices are hypotheses: the first pilots will validate them.",
     size=19, font=HEAD, italic=True, color=SAGE, align=PP_ALIGN.CENTER)
text(s, 0.82, 5.88, 11.7, 0.36,
     "Grants bridge the start: EIT, Research & Innovation Foundation Cyprus, EIC.",
     size=13, color=INK_MUTE, align=PP_ALIGN.CENTER)

notes(s, "[~10 s] An annual licence per hospital, a one-off set-up where we turn the "
         "hospital's contracts into its rules, and yearly review. The pilots will test "
         "these prices. (Optional slide: skip if short on time.)")


# ── 10 · GO-TO-MARKET ──────────────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
chrome(s, "06  ·  GO-TO-MARKET", "In through research, out through trusted channels")
for x, head, fill, body_fill, body in (
        (1.7, "STRATEGY 1  ·  THE RESEARCH DOOR", SAGE, SAGE_LT,
         "My PhD at European University Cyprus (from February 2027) opens two partner "
         "hospitals in Cyprus and Greece. CEO meetings are set for February."),
        (7.05, "STRATEGY 2  ·  TRUSTED CHANNELS", GOLD, CREAM,
         "Audit firms and accounting offices that already serve hospitals: they see "
         "billing risk in every audit.")):
    box(s, x, 1.85, 4.6, 0.6, fill=fill)
    text(s, x, 1.85, 4.6, 0.6, head, size=13, color=WHITE, bold=True,
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, spacing=100)
    box(s, x, 2.45, 4.6, 1.4, fill=body_fill)
    text(s, x + 0.25, 2.45, 4.1, 1.4, body, size=14, color=INK_SOFT,
         anchor=MSO_ANCHOR.MIDDLE)

box(s, 1.3, 4.97, 10.73, 0.04, fill=GOLD_LT)
for cx, year, label in ((2.2, "YEAR 1", "2 pilot hospitals\nin Cyprus and Greece"),
                        (6.67, "YEAR 2", "6 hospitals"),
                        (11.13, "YEAR 3", "15 hospitals,\nthen the Gulf (Qatar)")):
    text(s, cx - 1.6, 4.35, 3.2, 0.3, year, size=12, color=GOLD, bold=True,
         align=PP_ALIGN.CENTER, spacing=150)
    box(s, cx - 0.25, 4.74, 0.5, 0.5, fill=SAGE, shape=MSO_SHAPE.OVAL)
    text(s, cx - 1.6, 5.38, 3.2, 0.75, label, size=14, color=INK, align=PP_ALIGN.CENTER)

notes(s, "[~15 s] Getting into hospitals is the hardest part for health founders. I met a "
         "founder whose breast-cancer app never got in, because she was an outsider. I go "
         "in as a doctoral researcher, with my university's two partner hospitals, and I "
         "meet both CEOs in February. Then audit firms and accounting offices, who already "
         "have the hospitals' trust, carry us further.")


# ── 11 · COMPETITION ───────────────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
chrome(s, "07  ·  COMPETITION", "Before payment, and built on each hospital's own rules")
line(s, 1.6, 4.15, 11.8, 4.15, color=INK, width=1.5)
line(s, 6.7, 1.95, 6.7, 6.4, color=INK, width=1.5)
text(s, 0.45, 3.85, 1.1, 0.6, "Generic\nrules", size=12, color=INK, bold=True,
     align=PP_ALIGN.RIGHT)
text(s, 11.9, 3.85, 1.3, 0.6, "Hospital's\nown rules", size=12, color=INK, bold=True)
text(s, 5.2, 1.6, 3.0, 0.32, "Before payment", size=12, color=INK, bold=True,
     align=PP_ALIGN.CENTER)
text(s, 5.2, 6.45, 3.0, 0.32, "After the damage", size=12, color=INK, bold=True,
     align=PP_ALIGN.CENTER)
for x, y, w, label in ((1.9, 2.35, 3.6, "ERP duplicate checks (SAP, Oracle)"),
                       (3.1, 3.2, 3.2, "US revenue-cycle software"),
                       (1.8, 5.0, 3.6, "Payer rejections (EOPYY, insurers)"),
                       (7.1, 5.65, 2.4, "External audits"),
                       (9.0, 4.55, 2.7, "Manual Excel checks")):
    text(s, x, y, w, 0.35, label, size=13, italic=True, color=OTHERS)
box(s, 9.45, 2.0, 2.7, 1.45, line=SAGE, line_w=3.0, shape=MSO_SHAPE.OVAL)
text(s, 9.45, 2.0, 2.7, 1.45, [[("HealthLedger AI", {"font": HEAD, "bold": True, "size": 17, "color": INK})],
                                [("You are here.", {"italic": True, "size": 13, "color": SAGE})]],
     align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

notes(s, "[~10 s] Most checks today are either generic, like ERP duplicate checks, or "
         "come too late, like payer rejections and audits. HealthLedger AI works before "
         "payment and on each hospital's own rules. (Optional slide.)")


# ── 12 · TRACTION ──────────────────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
chrome(s, "08  ·  TRACTION", "Built, tested, and the doors are opening")
cols = (("CURRENT", SAGE, SAGE_LT, (
            "Working prototype: 11 error checks, tested on 506 synthetic invoices",
            "Tamper-evident audit trail and GDPR pilot package",
            "8 weeks in a Greek accounting office (Erasmus for Young Entrepreneurs)",
            "Selected for this Lab from 300+ applications",
            "Patent disclosure prepared")),
        ("IN PROGRESS", GOLD, CREAM, (
            "EOPYY claim pre-checks: built, testing on EOPYY data next",
            "PhD at European University Cyprus, from February 2027",
            "Meetings with the CEOs of 2 university partner hospitals (Cyprus, Greece): February 2027",
            "Company registration in Cyprus: February 2027")),
        ("OUTREACH", INK, RGBColor(0xEF, 0xEC, 0xE6), (
            "Expert calls with AI founders and growth leaders",
            "Hospital CFOs, audit firms and data-protection experts",
            "Private hospitals in the Gulf (Qatar)")))
for i, (head, hfill, bfill, items) in enumerate(cols):
    x = 0.82 + i * (3.6 + 0.45)
    box(s, x, 1.85, 3.6, 0.62, fill=hfill)
    text(s, x, 1.85, 3.6, 0.62, head, size=16, color=WHITE, bold=True,
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, spacing=150)
    box(s, x, 2.47, 3.6, 3.95, fill=bfill)
    text(s, x + 0.25, 2.65, 3.15, 3.7,
         [[("•  ", {"color": hfill, "bold": True}), (item, {})] for item in items],
         size=14, color=INK_SOFT, space_after=9)

notes(s, "[~15 s] What exists today: a working prototype with a tamper-evident audit "
         "trail, eight weeks inside a Greek accounting office, and a place in this Lab. "
         "In progress: my PhD and meetings with the CEOs of two hospitals in February, "
         "and the company in Cyprus at the same time.")


# ── 13 · TEAM ──────────────────────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
chrome(s, "09  ·  TEAM", "A founder from inside hospital finance")
people = (("MP", False, "Maria Polychroniadou", "Founder & CEO",
           "Clients, product and vision · built the prototype from zero code · M.Sc. Data Analytics in Accounting & Finance",
           "European University Cyprus"),
          ("EP", False, "Eleftheria Psilou", "Advisor · IT",
           "Co-founder of Theon Health · M.Sc. student in Computer Science",
           "University of Crete"),
          ("VS", False, "Viktória Schultz", "Advisor · operations",
           "Contracts, scheduling and administration · supply planner in the automotive industry",
           "Hochschule Niederrhein"),
          ("+", True, "Hospital finance", "Advisor · recruiting",
           "A hospital CFO or audit partner: the buyer's view and the audit channel",
           "Recruiting now"))
colw = 11.7 / 4
for i, (initials, open_seat, name, role, bg, org) in enumerate(people):
    cx = 0.82 + colw * i + colw / 2
    box(s, cx - 0.83, 1.8, 1.66, 1.66,
        fill=WHITE if open_seat else SAGE_LT, line=GOLD if open_seat else SAGE,
        line_w=1.75, shape=MSO_SHAPE.OVAL, dash=open_seat)
    text(s, cx - 0.83, 1.8, 1.66, 1.66, initials, size=36 if open_seat else 30, font=HEAD,
         color=GOLD if open_seat else SAGE, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    x = cx - colw / 2 + 0.1
    w = colw - 0.2
    text(s, x, 3.55, w, 0.75, name, size=15, font=HEAD, color=INK, bold=True,
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.BOTTOM)
    text(s, x, 4.35, w, 0.34, role, size=13, italic=True, color=SAGE, align=PP_ALIGN.CENTER)
    text(s, x, 4.75, w, 1.05, bg, size=12.5, color=INK_SOFT, align=PP_ALIGN.CENTER)
    text(s, x, 5.85, w, 0.34, org, size=12, color=GOLD, bold=True, align=PP_ALIGN.CENTER)

notes(s, "[~10 s] I built the prototype myself, from zero code, alongside a master's in "
         "data analytics for accounting. Eleftheria Psilou, co-founder of Theon Health, "
         "advises on IT. Viktória Schultz takes care of contracts, scheduling and "
         "administration, so I can spend my time with hospitals and new ideas. And I am "
         "recruiting a hospital finance advisor: a CFO or an audit partner.")


# ── 14 · ASK ───────────────────────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
chrome(s, "10  ·  THE ASK", "What €10,000 unlocks")
text(s, 0.82, 1.7, 11.7, 1.3, "€10,000", size=72, font=HEAD, color=INK,
     align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
box(s, 4.4, 3.1, 4.55, 0.04, fill=SAGE)
box(s, 3.0, 3.45, 7.35, 2.15, fill=SAGE_LT, line=SAGE, line_w=0.75)
text(s, 3.2, 3.6, 6.95, 1.9, [
    [("It gets the first hospital pilot ready for 2027:", {"bold": True, "color": INK})],
    [("1.  Company set-up in Cyprus", {})],
    [("2.  Data-protection and ethics groundwork (DPA, DPIA)", {})],
    [("3.  A pilot that measures each hospital's error cost, in euros", {})]],
    size=16, color=INK_SOFT, align=PP_ALIGN.CENTER, space_after=6)
text(s, 0.82, 5.85, 11.7, 0.5,
     "And from this room: introductions to hospital CFOs, audit firms and health-AI investors.",
     size=18, font=HEAD, italic=True, color=SAGE, align=PP_ALIGN.CENTER)

notes(s, "[~15 s] With 10,000 euros I get the first hospital pilot ready for 2027: the "
         "company in Cyprus, the data-protection and ethics groundwork, and a pilot that "
         "measures each hospital's error cost in euros. And from this room, I'd love "
         "introductions to hospital CFOs, audit firms and health-AI investors.")


# ── 15 · CLOSE ─────────────────────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
box(s, 0, 0, W, H, fill=INK)
box(s, 6.54, 1.55, 0.26, 0.26, fill=SAGE_GLOW, shape=MSO_SHAPE.OVAL)
text(s, 1.0, 2.1, 11.33, 1.2, "Nobody’s job title is “billing errors”.", size=44,
     font=HEAD, color=WHITE, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
text(s, 1.0, 3.35, 11.33, 0.8, "That’s why I built HealthLedger AI.", size=28,
     font=HEAD, italic=True, color=GOLD_LT, align=PP_ALIGN.CENTER)
box(s, 5.42, 4.45, 2.5, 0.03, fill=GOLD)
text(s, 1.0, 4.7, 11.33, 0.5,
     "Maria Polychroniadou   ·   info@healthledgerai.com   ·   healthledgerai.com",
     size=15, color=CREAM, align=PP_ALIGN.CENTER)

notes(s, "[~5 s] Nobody's job title is 'billing errors'. That's why I built HealthLedger "
         "AI. Thank you.")


out = "HealthLedgerAI_EIT_Pitch.pptx"
prs.save(out)
print("saved", out, "·", len(prs.slides), "slides")

"""
HealthLedger AI — EIT AI Entrepreneurs Lab pitch deck (Demo Day, 13 Nov 2026)

Structure v5 (Maria, 12 Nov):
 1  Title: name + details, dark design
 2  Issue: patient story, centred
 3  Problem: BILLING ERROR / MISSING REVENUE / UNKNOWN (Cyprus figures)
 4  Why today's checks miss the errors (optional in a 3-minute slot)
 5  Reveal: HealthLedger AI + €21K, nothing else
 6-8  How it works: 3-click animation — an invoice travels the pipeline
      (Morph transitions; on older PowerPoint they degrade to a fade)
 9  Cost reduction a CFO can count
10  Market: the information inside the bubbles
11  Business model (optional)   12 Go-to-market
13  Competition as wordmark badges (optional)
14-16  Traction: three-click build, short lines
17  Team   18 Ask + LinkedIn QR

Run:  python3 build_eit_pitch.py   ->  HealthLedgerAI_EIT_Pitch.pptx
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE, MSO_CONNECTOR
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR, MSO_AUTO_SIZE
from pptx.enum.dml import MSO_LINE_DASH_STYLE
from pptx.oxml.ns import qn
from lxml import etree

# ── COLOURS (Embryolab palette) ────────────────────────────────────────────────
SAGE      = RGBColor(0x3D, 0x6B, 0x52)
SAGE_LT   = RGBColor(0xEB, 0xF2, 0xEE)
SAGE_MID  = RGBColor(0xC5, 0xD9, 0xCC)
SAGE_DARK = RGBColor(0x8F, 0xB3, 0x9C)
SAGE_GLOW = RGBColor(0x7F, 0xA8, 0x8E)
GOLD      = RGBColor(0xA0, 0x85, 0x58)
GOLD_LT   = RGBColor(0xC9, 0xAA, 0x7C)
CREAM     = RGBColor(0xF5, 0xF0, 0xE8)
WHITE     = RGBColor(0xFF, 0xFF, 0xFF)
INK       = RGBColor(0x1A, 0x16, 0x14)
INK_SOFT  = RGBColor(0x4A, 0x44, 0x38)
INK_MUTE  = RGBColor(0x8A, 0x80, 0x70)
RED       = RGBColor(0xB0, 0x3A, 0x2A)
RED_LT    = RGBColor(0xFA, 0xEA, 0xE7)
RED_GLOW  = RGBColor(0xE8, 0x8A, 0x78)
LINE_GREY = RGBColor(0xE8, 0xE2, 0xD6)
OTHERS    = RGBColor(0x9D, 0xB0, 0xA4)

C_SAP    = RGBColor(0x0A, 0x6E, 0xD1)
C_ORACLE = RGBColor(0xC7, 0x46, 0x34)
C_EOPYY  = RGBColor(0x1B, 0x5E, 0xA6)
C_EXCEL  = RGBColor(0x21, 0x73, 0x46)
C_GREY   = RGBColor(0x5B, 0x67, 0x70)

HEAD = "Georgia"
BODY = "Calibri"

W, H = 13.333, 7.5
LINKEDIN_URL = "https://www.linkedin.com/in/maria-polychroniadou-74056a236"

prs = Presentation()
prs.slide_width = Inches(W)
prs.slide_height = Inches(H)
BLANK = prs.slide_layouts[6]


# ── HELPERS ────────────────────────────────────────────────────────────────────

def box(slide, x, y, w, h, fill=None, line=None, line_w=0.75,
        shape=MSO_SHAPE.RECTANGLE, radius=None, dash=False, name=None):
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
    if name:
        shp.name = name
    return shp


def text(slide, x, y, w, h, content, size=14, font=BODY, color=INK_SOFT,
         bold=False, italic=False, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP,
         spacing=None, line_spacing=None, space_after=None, name=None):
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.auto_size = MSO_AUTO_SIZE.NONE
    tf.vertical_anchor = anchor
    for side in ("margin_left", "margin_right", "margin_top", "margin_bottom"):
        setattr(tf, side, Inches(0.02))
    if isinstance(content, str):
        paras = [[(seg, {})] for seg in content.split("\n")]
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
    if name:
        tb.name = name
    return tb


def line(slide, x1, y1, x2, y2, color=GOLD, width=1.0, dash=False, name=None):
    c = slide.shapes.add_connector(MSO_CONNECTOR.STRAIGHT,
                                   Inches(x1), Inches(y1), Inches(x2), Inches(y2))
    c.line.color.rgb = color
    c.line.width = Pt(width)
    if dash:
        c.line.dash_style = MSO_LINE_DASH_STYLE.DASH
    if name:
        c.name = name
    return c


def notes(slide, talk):
    slide.notes_slide.notes_text_frame.text = talk


def chrome(slide, kicker, title):
    box(slide, 0, 0, W, 0.45, fill=CREAM)
    text(slide, 0.6, 0.12, 9, 0.26, kicker, size=10, color=GOLD, bold=True, spacing=180)
    text(slide, 0.6, 0.6, 12.1, 0.8, title, size=30, font=HEAD, color=INK)
    box(slide, 0.6, 1.42, 9.6, 0.035, fill=SAGE)
    box(slide, 0, 7.05, W, 0.45, fill=INK)
    text(slide, 0.6, 7.15, 6, 0.28, "EIT AI Entrepreneurs Lab  ·  2026", size=10, color=GOLD_LT)
    text(slide, W - 4.1, 7.09, 3.5, 0.36, "HealthLedger AI", size=15, font=HEAD,
         color=WHITE, align=PP_ALIGN.RIGHT)


def stat_boxes(slide, items, head_fill, body_fill, body_line, num_color,
               top=1.95, head_h=0.65, body_h=2.45, x0=0.82, w=3.6, gap=0.45):
    for i, (label, number, caption) in enumerate(items):
        x = x0 + i * (w + gap)
        hf = head_fill[i] if isinstance(head_fill, list) else head_fill
        box(slide, x, top, w, head_h, fill=hf)
        text(slide, x, top, w, head_h, label, size=15, color=WHITE, bold=True,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, spacing=150)
        box(slide, x, top + head_h, w, body_h, fill=body_fill, line=body_line)
        text(slide, x, top + head_h + 0.12, w, 0.95, number, size=46, font=HEAD,
             color=num_color, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        text(slide, x + 0.25, top + head_h + 1.1, w - 0.5, body_h - 1.2, caption,
             size=15, color=INK_SOFT, align=PP_ALIGN.CENTER)


def bang(slide, x, y, d, fill=RED, size=None, name=None):
    box(slide, x, y, d, d, fill=fill, shape=MSO_SHAPE.OVAL, name=name)
    text(slide, x, y, d, d, "!", size=size or int(d * 40), font=HEAD, color=WHITE,
         bold=True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE,
         name=(name + "_t") if name else None)


MORPH_XML = (
    '<mc:AlternateContent '
    'xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" '
    'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">'
    '<mc:Choice xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main" '
    'Requires="p159">'
    '<p:transition xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" '
    'spd="slow" p14:dur="700"><p159:morph option="byObject"/></p:transition>'
    '</mc:Choice>'
    '<mc:Fallback><p:transition spd="slow"><p:fade/></p:transition></mc:Fallback>'
    '</mc:AlternateContent>')


def add_morph(slide):
    """The slide ENTERS with a Morph transition (older PowerPoint: a fade)."""
    el = etree.fromstring(MORPH_XML.encode())
    clr = slide.element.find(qn('p:clrMapOvr'))
    if clr is not None:
        clr.addnext(el)
    else:
        slide.element.append(el)


# ── 1 · TITLE: NAME + DETAILS ──────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
box(s, 0, 0, W, H, fill=INK)
box(s, 0.92, 2.72, 0.26, 0.26, fill=SAGE_GLOW, shape=MSO_SHAPE.OVAL)
text(s, 1.32, 2.22, 10.8, 1.1, "HealthLedger AI", size=58, font=HEAD, color=WHITE)
box(s, 0.92, 3.75, 3.8, 0.03, fill=GOLD)
text(s, 0.92, 4.0, 9, 0.5, "Maria Polychroniadou", size=24, font=HEAD, color=WHITE)
text(s, 0.92, 4.55, 9, 0.35, "Founder & CEO", size=15, color=GOLD_LT)
text(s, 0.92, 4.93, 9, 0.35, "healthledgerai.com   ·   info@healthledgerai.com",
     size=13.5, color=CREAM)
text(s, 0.92, 6.85, 11, 0.3,
     "EIT AI ENTREPRENEURS LAB  ·  AI HOUSE AMSTERDAM  ·  13 NOVEMBER 2026",
     size=10, color=GOLD, bold=True, spacing=200)

notes(s, "[~35 s] THE OPENER — live sketch. Prop: the printed INVOICE 0458 (A4). Pick "
         "your partner during the 14:35 'Meet the Jury' reverse pitch — the most playful "
         "juror, or a friendly founder in the front row.\n"
         "'What's your name?' — (answer) — 'Really?! Mine too!' (big smile, keep moving)\n"
         "'And let me guess — born on the 14th of May? …In this story, you are.'\n"
         "(hold up the bill) 'So why did I receive an invoice for a procedure I never "
         "had?!'\n"
         "(beat — drop the smile)\n"
         "'Ladies and gentlemen, my name is Maria Polychroniadou — and what I just played "
         "for you is not a joke. It happened.'  -> click\n\n"
         "IF THE PARTNER refuses or clowns: 'See — finding one match in this room is "
         "hard. Hospital databases find them every day.' — and carry on.")


# ── 2 · ISSUE: THE PATIENT STORY ───────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
chrome(s, "01  ·  THE ISSUE", "One wrong invoice. One innocent patient in court.")

for x, label, rec, wrong in ((0.95, "PATIENT A", "Record P-031", False),
                             (7.9, "PATIENT B", "Record P-101", True)):
    box(s, x, 1.85, 4.5, 2.75, fill=WHITE, line=RED if wrong else INK_MUTE,
        line_w=2.25 if wrong else 1.0, shape=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.05)
    text(s, x + 0.35, 2.1, 3.9, 0.32, label, size=13, color=GOLD, bold=True, spacing=150)
    text(s, x + 0.35, 2.5, 3.9, 0.65, "Eleni K.", size=34, font=HEAD, color=INK)
    text(s, x + 0.35, 3.3, 3.9, 0.4, "Born 14.05.1978", size=19, color=INK_SOFT)
    text(s, x + 0.35, 3.85, 3.9, 0.35, rec, size=14, color=INK_MUTE)
text(s, 5.45, 2.35, 2.45, 1.0, "=", size=64, font=HEAD, color=RED,
     align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

box(s, 5.57, 3.6, 2.2, 0.78, fill=RED_LT, line=RED, line_w=1.25)
text(s, 5.57, 3.68, 2.2, 0.32, "INVOICE", size=12.5, color=RED, bold=True,
     align=PP_ALIGN.CENTER, spacing=120)
text(s, 5.57, 4.0, 2.2, 0.32, "meant for Patient A", size=11, color=INK_SOFT,
     align=PP_ALIGN.CENTER)
box(s, 7.5, 3.83, 0.38, 0.3, fill=RED, shape=MSO_SHAPE.RIGHT_ARROW)

box(s, 0.95, 4.95, 11.45, 0.78, fill=RED_LT)
box(s, 0.95, 4.95, 0.08, 0.78, fill=RED)
text(s, 1.22, 4.97, 11.05, 0.72,
     "The invoice went to the wrong patient, who then faced legal proceedings.",
     size=18, font=HEAD, color=INK, anchor=MSO_ANCHOR.MIDDLE)
text(s, 0.95, 5.95, 11.45, 0.5, "One automated check would have stopped it.",
     size=21, font=HEAD, italic=True, color=SAGE)
text(s, 0.6, 6.6, 12, 0.3,
     "A real case from a private hospital in Greece. Names and details changed.",
     size=11, italic=True, color=INK_MUTE)

notes(s, "[~15 s] Land the sketch:\n"
         "'A private hospital in Greece. Two patients. Same name, same date of birth. "
         "The invoice went to the wrong one — and she ended up facing legal proceedings. "
         "(pause) One automated check would have stopped it. That's why I built what "
         "I'll show you today.'\n"
         "-> click")


# ── 3 · PROBLEM ────────────────────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
chrome(s, "02  ·  THE PROBLEM", "Billing errors are common, costly and invisible")
stat_boxes(s, [
    ("BILLING ERROR", "up to 26%", "of manually processed hospital bills contain errors"),
    ("MISSING REVENUE", "€10 M", "in 80,000 provider claims rejected by Cyprus's national health insurer (reported 2024)"),
    ("UNKNOWN", "weeks", "before an error surfaces: at claim rejection, at payment, or in an audit"),
], head_fill=RED, body_fill=RED_LT, body_line=RED, num_color=RED)
text(s, 0.82, 5.32, 11.7, 0.55,
     "Nobody’s job title is “billing errors”, so nobody catches them.",
     size=22, font=HEAD, italic=True, color=INK, align=PP_ALIGN.CENTER)
text(s, 0.82, 6.55, 11.7, 0.3,
     "Sources: Nimkar et al. (2024)  ·  Cyprus Mail (Feb 2024): claims rejected by the HIO  ·  "
     "HealthLedger AI field interviews in Greek hospital accounting",
     size=10, color=INK_MUTE)

notes(s, "[~8 s] You already asked the questions in the intro, so keep this short. "
         "Point at the three boxes: billing errors happen constantly, revenue goes "
         "missing, and the error stays unknown for weeks.\n\n"
         "If asked about the 10 million: Cyprus's Health Insurance Organisation (HIO) "
         "rejected about 80,000 provider claims worth 10 million euros, reported by Cyprus "
         "Mail in February 2024. That is about 125 euros per rejected claim.")


# ── 4 · WHY TODAY'S CHECKS MISS THE ERRORS (optional) ─────────────────────────
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


# ── 5 · REVEAL: HEALTHLEDGER AI + €21K ─────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
box(s, 0, 0, W, H, fill=INK)
box(s, 0.92, 1.92, 0.26, 0.26, fill=SAGE_GLOW, shape=MSO_SHAPE.OVAL)
text(s, 1.32, 1.42, 10.8, 1.05, "HealthLedger AI", size=56, font=HEAD, color=WHITE)
text(s, 0.92, 2.72, 10.5, 0.6, "Catching costly hospital billing errors before payment.",
     size=24, font=HEAD, italic=True, color=GOLD_LT)
box(s, 0.92, 3.75, 3.8, 0.03, fill=GOLD)
text(s, 0.88, 4.0, 5.4, 1.6, "€21K", size=96, font=HEAD, color=SAGE_GLOW, bold=True)
text(s, 6.0, 4.42, 6.4, 0.9, "at risk, flagged before payment,\nin one test run of 506 invoices",
     size=18, color=CREAM)
text(s, 0.95, 6.35, 6, 0.3, "synthetic test data", size=11, italic=True, color=INK_MUTE)

notes(s, "[~20 s] THE REVEAL (don't read the slide):\n"
         "…That's why I've created — HealthLedger AI.\n"
         "It catches hospital billing errors before payment, by checking every invoice "
         "against the hospital's own contract rates and records. It runs read-only inside "
         "the hospital, and every decision is logged for the auditors.\n"
         "Point at the number: in one test run, it flagged 21 thousand euros at risk — "
         "including the bill in my hand. Let me show you how.  -> click")


# ── 6-8 · HOW IT WORKS: 3-CLICK ANIMATION ─────────────────────────────────────
STEPS = ("Billing data\n(Excel export)", "11 error\nchecks", "Ranked alerts\n(high · medium)",
         "A human\ndecides", "Tamper-evident\naudit trail")
SW, AW = 2.16, 0.4
X0 = (W - (len(STEPS) * SW + (len(STEPS) - 1) * AW)) / 2
PIPE_Y = 4.5


def node_x(i):
    return X0 + i * (SW + AW)


def pipeline(s):
    for i, label in enumerate(STEPS):
        x = node_x(i)
        box(s, x, PIPE_Y, SW, 0.95, fill=CREAM, line=GOLD, line_w=0.75,
            shape=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.15, name=f"!!node{i}")
        text(s, x, PIPE_Y, SW, 0.95, label, size=14, color=INK, align=PP_ALIGN.CENTER,
             anchor=MSO_ANCHOR.MIDDLE, name=f"!!nodetxt{i}")
        if i < len(STEPS) - 1:
            box(s, x + SW + 0.05, PIPE_Y + 0.32, AW - 0.1, 0.32, fill=GOLD,
                shape=MSO_SHAPE.RIGHT_ARROW, name=f"!!arr{i}")


def invoice(s, at_node, flagged, high):
    cx = node_x(at_node) + SW / 2
    x, y, w, h = cx - 1.3, 2.35, 2.6, 1.45
    line(s, cx, y + h, cx, PIPE_Y, color=RED if flagged else GOLD, width=1.25,
         dash=True, name="!!inv_ln")
    box(s, x, y, w, h, fill=WHITE, line=RED if flagged else INK_MUTE,
        line_w=2.0 if flagged else 1.0, shape=MSO_SHAPE.ROUNDED_RECTANGLE,
        radius=0.08, name="!!inv_bg")
    text(s, x + 0.18, y + 0.1, w - 0.36, 0.26, "INVOICE 0458", size=10, color=INK_MUTE,
         bold=True, spacing=120, name="!!inv_no")
    text(s, x + 0.18, y + 0.38, w - 0.36, 0.3, "CT scan abdomen", size=13.5, color=INK,
         bold=True, name="!!inv_proc")
    text(s, x + 0.18, y + 0.7, w - 0.36, 0.34, "€4,728.14", size=17, font=HEAD,
         color=RED if flagged else INK, bold=True, name="!!inv_amt")
    if flagged:
        text(s, x + 0.18, y + 1.08, w - 0.36, 0.28, "max by contract: €900", size=11,
             color=RED, name="!!inv_max")
        bang(s, x + w - 0.26, y - 0.19, 0.42, size=18, name="!!inv_bang")
    if high:
        box(s, x + w - 1.02, y + 0.12, 0.84, 0.3, fill=RED, name="!!inv_hi")
        text(s, x + w - 1.02, y + 0.12, 0.84, 0.3, "HIGH", size=11, color=WHITE, bold=True,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, spacing=150, name="!!inv_hit")


def demo_slide(subtitle):
    s = prs.slides.add_slide(BLANK)
    chrome(s, "03  ·  THE SOLUTION  ·  HOW IT WORKS", "How it works")
    text(s, 0.6, 1.58, 12.1, 0.4, subtitle, size=17, font=HEAD, italic=True, color=SAGE)
    pipeline(s)
    return s


# step 1 — the invoice arrives
s = demo_slide("Your billing data comes in — invoice by invoice.")
invoice(s, 0, flagged=False, high=False)
notes(s, "[~8 s] Here is how it works. The hospital's billing data comes in as a simple "
         "Excel export — no IT project. Every invoice enters the pipeline, like this "
         "one.  -> click (the invoice moves to the checks)")

# step 2 — the checks catch it (Morph)
s = demo_slide("Each invoice is checked against the hospital's own contract rates.")
invoice(s, 1, flagged=True, high=False)
s2 = s
notes(s, "[~10 s] Eleven error checks run on every invoice — against the hospital's own "
         "contract rates, not generic rules. This CT scan is billed at €4,728. The "
         "contract says €900 maximum. Caught.  -> click (the invoice becomes a ranked alert)")

# step 3 — ranked alert + the numbers (Morph)
s = demo_slide("Alerts are ranked — a human always decides.")
invoice(s, 2, flagged=True, high=True)
box(s, 1.5, 5.85, 10.33, 0.95, fill=INK, shape=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.12,
    name="!!band")
seg = 10.33 / 4
for i, (num, lab, col) in enumerate((("506", "invoices", WHITE), ("70", "alerts", WHITE),
                                     ("€21K", "at risk", GOLD_LT), ("53", "high risk", RED_GLOW))):
    text(s, 1.5 + i * seg, 5.85, seg, 0.95,
         [[(num, {"font": HEAD, "size": 26, "bold": True, "color": col}),
           ("  " + lab, {"size": 13, "color": CREAM})]],
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, name=f"!!bandt{i}")
text(s, 10.6, 1.63, 2.1, 0.3, "~1 second per run", size=12, color=INK_MUTE, italic=True,
     align=PP_ALIGN.RIGHT)
s3 = s
notes(s, "[~12 s] The alert is ranked high, with the action to take — and a human always "
         "makes the final decision, with every step logged for the auditors. The whole "
         "run: 506 invoices, 70 alerts, 21 thousand euros at risk — in about one second. "
         "(All on synthetic test data.)\n\n"
         "LIVE OPTION (only if the format allows and the laptop is yours): run "
         "python healthledgerai_demo.py in the HealthLedgerAI folder — about one second.")


# ── 9 · COST REDUCTION ─────────────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
chrome(s, "03  ·  THE SOLUTION  ·  COST REDUCTION", "Cost reduction a CFO can count")
stat_boxes(s, [
    ("BREAK-EVEN", "< 2", "caught errors a month pay for the licence (€425: the average error in our test data)"),
    ("FEWER DENIALS", "15–30%", "fewer claim denials with AI-enabled revenue-cycle tools (Nimkar et al., 2024)"),
    ("PER REJECTION", "€125", "average value of a claim rejected by Cyprus's health insurer (€10M ÷ 80,000 claims)"),
], head_fill=SAGE, body_fill=SAGE_LT, body_line=SAGE, num_color=SAGE)
text(s, 0.82, 5.32, 11.7, 0.5, "The first pilot measures it for each hospital, in euros.",
     size=20, font=HEAD, italic=True, color=INK, align=PP_ALIGN.CENTER)
text(s, 0.82, 6.4, 11.7, 0.45,
     "Break-even: €8K top licence ÷ €425 average error at risk (synthetic test data)  ·  "
     "Rejected claims: Cyprus Mail (Feb 2024)  ·  Denials: Nimkar et al. (2024)",
     size=10, color=INK_MUTE)

notes(s, "[~15 s] For a CFO, this is the point. Fewer than two caught errors a month pay "
         "for the licence, at the average error size in our test data. In Cyprus, every "
         "claim the insurer rejects is worth about 125 euros, and studies show AI cuts "
         "claim denials by 15 to 30 percent. The first pilot will measure the real number, "
         "in euros, for each hospital.")


# ── 10 · MARKET: THE INFORMATION IN THE BUBBLES ───────────────────────────────
s = prs.slides.add_slide(BLANK)
chrome(s, "04  ·  MARKET", "Start focused, then grow: Europe, the Gulf, the USA")

bx = 3.9  # centre x of the nested bubbles
box(s, bx - 2.5, 1.72, 5.0, 5.0, fill=SAGE_LT, line=SAGE_MID, shape=MSO_SHAPE.OVAL)
box(s, bx - 1.75, 3.2, 3.5, 3.5, fill=SAGE_MID, line=SAGE_DARK, shape=MSO_SHAPE.OVAL)
box(s, bx - 1.05, 4.58, 2.1, 2.1, fill=SAGE_DARK, line=SAGE, shape=MSO_SHAPE.OVAL)

text(s, bx - 2.0, 2.08, 4.0, 0.75, [
    [("EU HOSPITALS", {"bold": True, "size": 15, "color": SAGE})],
    [("2.3 million beds (Eurostat)", {"size": 12.5, "color": INK_SOFT})]],
    align=PP_ALIGN.CENTER)
text(s, bx - 1.7, 3.52, 3.4, 0.75, [
    [("GREECE & CYPRUS", {"bold": True, "size": 14, "color": SAGE})],
    [("~140 private hospitals in GR (ELSTAT)", {"size": 11.5, "color": INK_SOFT})]],
    align=PP_ALIGN.CENTER)
text(s, bx - 1.0, 5.1, 2.0, 1.1, [
    [("15 HOSPITALS", {"bold": True, "size": 13, "color": INK})],
    [("in 3 years", {"size": 11.5, "color": INK_SOFT})],
    [("€120K / yr (plan)", {"size": 11.5, "color": INK_SOFT})]],
    align=PP_ALIGN.CENTER)

box(s, 7.35, 3.52, 0.6, 0.38, fill=GOLD, shape=MSO_SHAPE.RIGHT_ARROW)
box(s, 8.3, 2.5, 3.3, 3.3, fill=None, line=GOLD, line_w=2.0,
    shape=MSO_SHAPE.OVAL, dash=True)
text(s, 8.55, 3.15, 2.8, 2.0, [
    [("NEXT", {"bold": True, "size": 11, "color": GOLD, "spacing": 180})],
    [("", {"size": 6})],
    [("Gulf (Qatar)", {"font": HEAD, "size": 19, "color": INK})],
    [("USA", {"font": HEAD, "size": 19, "color": INK})],
    [("", {"size": 6})],
    [("first introductions via EBAN", {"size": 12, "color": INK_SOFT, "italic": True})]],
    align=PP_ALIGN.CENTER)

notes(s, "[~15 s] We start where I have access and speak the language: Greece and Cyprus, "
         "about 140 private hospitals in Greece alone — 15 hospitals in the first three "
         "years. Then the rest of Europe, with 2.3 million hospital beds. And next: the "
         "Gulf, where I already have contacts, and the USA — a largely private hospital "
         "market. This week EBAN's Martin Skea connected me to the US, for expansion once "
         "the two pilot hospitals have proven it.")


# ── 11 · BUSINESS MODEL (optional) ─────────────────────────────────────────────
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


# ── 12 · GO-TO-MARKET ──────────────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
chrome(s, "06  ·  GO-TO-MARKET", "In through research, out through trusted channels")
for x, head, fill in ((0.82, "STRATEGY 1  ·  THE RESEARCH DOOR", SAGE),
                      (6.96, "STRATEGY 2  ·  TRUSTED CHANNELS", GOLD)):
    box(s, x, 1.85, 5.55, 0.62, fill=fill)
    text(s, x, 1.85, 5.55, 0.62, head, size=14, color=WHITE, bold=True,
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, spacing=100)

box(s, 1.3, 4.32, 10.73, 0.05, fill=GOLD_LT)
for cx, year, label in ((2.2, "YEAR 1", "2 pilot hospitals\nin Cyprus and Greece"),
                        (6.67, "YEAR 2", "6 hospitals"),
                        (11.13, "YEAR 3", "15 hospitals,\nthen the Gulf (Qatar)")):
    text(s, cx - 1.8, 3.55, 3.6, 0.35, year, size=14, color=GOLD, bold=True,
         align=PP_ALIGN.CENTER, spacing=150)
    box(s, cx - 0.3, 4.05, 0.6, 0.6, fill=SAGE, shape=MSO_SHAPE.OVAL)
    text(s, cx - 1.8, 4.85, 3.6, 0.85, label, size=16, color=INK, align=PP_ALIGN.CENTER)

notes(s, "[~15 s] Getting into hospitals is the hardest part for health founders. I met a "
         "founder whose breast-cancer app never got in, because she was an outsider. I go "
         "in as a doctoral researcher, with my university's two partner hospitals, and I "
         "meet both CEOs in February. Then audit firms and accounting offices, who already "
         "have the hospitals' trust, carry us further.")


# ── 13 · COMPETITION (optional) ────────────────────────────────────────────────
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


def badge(x, y, w, label, col, caption):
    box(s, x, y, w, 0.52, fill=WHITE, line=LINE_GREY, line_w=1.0,
        shape=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.5)
    text(s, x, y, w, 0.52, label, size=15, font=BODY, color=col, bold=True,
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, spacing=60)
    text(s, x - 0.3, y + 0.56, w + 0.6, 0.3, caption, size=10.5, italic=True,
         color=OTHERS, align=PP_ALIGN.CENTER)


badge(1.9, 2.3, 2.9, "SAP  ·  ORACLE", C_SAP, "ERP duplicate checks")
badge(3.3, 3.25, 2.9, "US RCM SOFTWARE", C_GREY, "revenue-cycle tools")
badge(1.7, 4.85, 2.0, "EOPYY", C_EOPYY, "payer rejections · insurers")
badge(7.2, 5.4, 2.3, "AUDIT FIRMS", INK_SOFT, "external audits")
badge(9.3, 4.5, 2.0, "EXCEL", C_EXCEL, "manual checks")

box(s, 9.45, 2.0, 2.7, 1.45, line=SAGE, line_w=3.0, shape=MSO_SHAPE.OVAL)
text(s, 9.45, 2.0, 2.7, 1.45, "HealthLedger AI", size=17, font=HEAD, color=INK, bold=True,
     align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
text(s, 0.6, 6.7, 12.1, 0.28,
     "Wordmarks shown for comparison — replace with official logos before presenting.",
     size=9, italic=True, color=INK_MUTE)

notes(s, "[~10 s] Most checks today are either generic, like ERP duplicate checks, or "
         "come too late, like payer rejections and audits. HealthLedger AI works before "
         "payment and on each hospital's own rules. (Optional slide.)")


# ── 14-16 · TRACTION: 3-CLICK BUILD ───────────────────────────────────────────
TR_COLS = (("CURRENT", SAGE, SAGE_LT, (
                "Working prototype — 11 error checks",
                "Field-tested in a Greek accounting office",
                "Top 11 of 300+  ·  patent drafted")),
           ("IN PROGRESS — FEB 2027", GOLD, CREAM, (
                "PhD at European University Cyprus",
                "CEO meetings — 2 partner hospitals",
                "Company set-up in Cyprus")),
           ("OUTREACH", INK, RGBColor(0xEF, 0xEC, 0xE6), (
                "CFOs · audit firms · DPOs",
                "Gulf: Qatar",
                "USA — via EBAN")))


def traction_slide(n_cols):
    s = prs.slides.add_slide(BLANK)
    chrome(s, "08  ·  TRACTION", "Built, tested, and the doors are opening")
    for i in range(n_cols):
        head, hfill, bfill, items = TR_COLS[i]
        x = 0.82 + i * (3.6 + 0.45)
        box(s, x, 2.0, 3.6, 0.8, fill=hfill, name=f"!!tr{i}_h")
        text(s, x, 2.0, 3.6, 0.8, head, size=17, color=WHITE, bold=True,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, spacing=120,
             name=f"!!tr{i}_ht")
        box(s, x, 2.8, 3.6, 3.4, fill=bfill, name=f"!!tr{i}_b")
        text(s, x + 0.28, 3.15, 3.05, 2.9,
             [[("•  ", {"color": hfill, "bold": True}), (item, {})] for item in items],
             size=16, color=INK_SOFT, space_after=20, name=f"!!tr{i}_t")
    return s


s = traction_slide(1)
notes(s, "[~8 s] Where we stand. Today: a working prototype with 11 error checks, "
         "field-tested in a Greek accounting office, selected for this Lab from more "
         "than 300 applications, and the patent disclosure is drafted.  -> click")
s = traction_slide(2)
tr2 = s
notes(s, "[~8 s] In progress, all February 2027: my PhD starts at European University "
         "Cyprus, I meet the CEOs of the two partner hospitals, and the company is "
         "registered in Cyprus.  -> click")
s = traction_slide(3)
tr3 = s
notes(s, "[~8 s] And the doors opening: hospital CFOs, audit firms and data-protection "
         "experts — then Qatar, and this week EBAN connected me toward the USA for the "
         "expansion after the pilots.")


# ── 17 · TEAM ──────────────────────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
chrome(s, "09  ·  TEAM", "A founder from inside hospital finance")
people = (("MP", "Maria Polychroniadou", "Founder & CEO",
           "Clients, product and vision · built the prototype from zero code · M.Sc. Data Analytics in Accounting & Finance",
           "European University Cyprus"),
          ("EP", "Eleftheria Psilou", "Advisor · IT",
           "Co-founder of Theon Health · M.Sc. student in Computer Science",
           "University of Crete"),
          ("VS", "Viktória Schultz", "Advisor · operations",
           "Contracts, scheduling and administration · supply planner in the automotive industry",
           "Hochschule Niederrhein"))
colw = 11.7 / 3
for i, (initials, name, role, bg, org) in enumerate(people):
    cx = 0.82 + colw * i + colw / 2
    box(s, cx - 0.85, 1.8, 1.7, 1.7, fill=SAGE_LT, line=SAGE, line_w=1.75,
        shape=MSO_SHAPE.OVAL)
    text(s, cx - 0.85, 1.8, 1.7, 1.7, initials, size=30, font=HEAD, color=SAGE,
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    x = cx - colw / 2 + 0.15
    w = colw - 0.3
    text(s, x, 3.65, w, 0.45, name, size=17, font=HEAD, color=INK, bold=True,
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.BOTTOM)
    text(s, x, 4.15, w, 0.34, role, size=13.5, italic=True, color=SAGE, align=PP_ALIGN.CENTER)
    text(s, x, 4.6, w, 1.3, bg, size=12.5, color=INK_SOFT, align=PP_ALIGN.CENTER)
    text(s, x, 5.95, w, 0.34, org, size=12, color=GOLD, bold=True, align=PP_ALIGN.CENTER)

notes(s, "[~10 s] I built the prototype myself, from zero code, alongside a master's in "
         "data analytics for accounting. Eleftheria Psilou, co-founder of Theon Health, "
         "advises on IT. Viktória Schultz takes care of contracts, scheduling and "
         "administration, so I can spend my time with hospitals and new ideas. And I am "
         "recruiting a hospital finance advisor: a CFO or an audit partner.")


# ── 18 · ASK + QR ──────────────────────────────────────────────────────────────
s = prs.slides.add_slide(BLANK)
chrome(s, "10  ·  THE ASK", "What €10,000 unlocks")
text(s, 0.82, 1.7, 11.7, 1.3, "€10,000", size=72, font=HEAD, color=INK,
     align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
box(s, 4.4, 3.1, 4.55, 0.04, fill=SAGE)
box(s, 2.6, 3.45, 7.35, 2.15, fill=SAGE_LT, line=SAGE, line_w=0.75)
text(s, 2.8, 3.6, 6.95, 1.9, [
    [("It gets the first hospital pilot ready for 2027:", {"bold": True, "color": INK})],
    [("1.  Company set-up in Cyprus", {})],
    [("2.  Data-protection and ethics groundwork (DPA, DPIA)", {})],
    [("3.  A pilot that measures each hospital's error cost, in euros", {})]],
    size=16, color=INK_SOFT, align=PP_ALIGN.CENTER, space_after=6)
text(s, 0.82, 5.85, 11.7, 0.5,
     "And from this room: introductions to hospital CFOs, audit firms and health-AI investors.",
     size=18, font=HEAD, italic=True, color=SAGE, align=PP_ALIGN.CENTER)

import qrcode
qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=10, border=2)
qr.add_data(LINKEDIN_URL)
qr.make(fit=True)
qr.make_image(fill_color="#1A1614", back_color="white").save("linkedin_qr.png")
box(s, 10.52, 3.32, 1.76, 1.76, fill=WHITE, line=LINE_GREY, line_w=1.0)
s.shapes.add_picture("linkedin_qr.png", Inches(10.6), Inches(3.4), Inches(1.6), Inches(1.6))
text(s, 10.37, 5.12, 2.06, 0.3, "Connect on LinkedIn", size=10.5, color=INK_MUTE,
     align=PP_ALIGN.CENTER)

notes(s, "[~15 s] With 10,000 euros I get the first hospital pilot ready for 2027: the "
         "company in Cyprus, the data-protection and ethics groundwork, and a pilot that "
         "measures each hospital's error cost in euros. And from this room, I'd love "
         "introductions to hospital CFOs, audit firms and health-AI investors. The QR "
         "code goes to my LinkedIn — I'd be glad to connect.")


# ── MORPH TRANSITIONS on the animation steps ───────────────────────────────────
add_morph(s2)   # demo step 2 enters with Morph
add_morph(s3)   # demo step 3
add_morph(tr2)  # traction step 2
add_morph(tr3)  # traction step 3

out = "HealthLedgerAI_EIT_Pitch.pptx"
prs.save(out)
print("saved", out, "·", len(prs.slides), "slides")

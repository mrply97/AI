// Astrological calculation utilities using the astronomia library (VSOP87).
// All returned longitudes are geocentric ecliptic degrees in [0, 360).

import { julian, solar, moonposition, planetposition, pluto as plutoMod, sidereal } from 'astronomia'
import earthData  from 'astronomia/data/vsop87Bearth'
import mercData   from 'astronomia/data/vsop87Bmercury'
import venusData  from 'astronomia/data/vsop87Bvenus'
import marsData   from 'astronomia/data/vsop87Bmars'
import jupData    from 'astronomia/data/vsop87Bjupiter'
import satData    from 'astronomia/data/vsop87Bsaturn'
import urData     from 'astronomia/data/vsop87Buranus'
import nepData    from 'astronomia/data/vsop87Bneptune'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const earth   = new (planetposition as any).Planet((earthData  as any).default)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mercury = new (planetposition as any).Planet((mercData   as any).default)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const venus   = new (planetposition as any).Planet((venusData  as any).default)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mars    = new (planetposition as any).Planet((marsData   as any).default)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jupiter = new (planetposition as any).Planet((jupData    as any).default)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const saturn  = new (planetposition as any).Planet((satData    as any).default)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const uranus  = new (planetposition as any).Planet((urData     as any).default)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const neptune = new (planetposition as any).Planet((nepData    as any).default)

export interface PlanetPos {
  name: string
  symbol: string
  lon: number       // 0–360 geocentric ecliptic
  sign: string
  signDeg: number   // degrees within sign (0–30)
  signMin: number
  retrograde?: boolean
}

export interface AspectInfo {
  transitPlanet: string
  natalPlanet: string
  aspect: string
  angle: number
  orb: number
  applying: boolean
  quality: 'major' | 'minor'
  interpretation: string
}

// ─── helpers ────────────────────────────────────────────────────────────────

function jcent(jde: number) { return (jde - 2451545.0) / 36525 }
function norm(d: number)    { return ((d % 360) + 360) % 360 }

function geoLon(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  planet: any,
  jde: number
): number {
  const pe = planet.position(jde)
  const ee = earth.position(jde)
  const x =
    pe.range * Math.cos(pe.lat) * Math.cos(pe.lon) -
    ee.range * Math.cos(ee.lat) * Math.cos(ee.lon)
  const y =
    pe.range * Math.cos(pe.lat) * Math.sin(pe.lon) -
    ee.range * Math.cos(ee.lat) * Math.sin(ee.lon)
  return norm(Math.atan2(y, x) * (180 / Math.PI))
}

function plutoLon(jde: number): number {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ph = (plutoMod as any).heliocentric(jde)
  const ee = earth.position(jde)
  const x = ph.range * Math.cos(ph.lat) * Math.cos(ph.lon) - ee.range * Math.cos(ee.lat) * Math.cos(ee.lon)
  const y = ph.range * Math.cos(ph.lat) * Math.sin(ph.lon) - ee.range * Math.cos(ee.lat) * Math.sin(ee.lon)
  return norm(Math.atan2(y, x) * (180 / Math.PI))
}

const SIGNS = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces',
]
const SYMBOLS: Record<string, string> = {
  Sun:'☉', Moon:'☽', Mercury:'☿', Venus:'♀', Mars:'♂',
  Jupiter:'♃', Saturn:'♄', Uranus:'♅', Neptune:'♆', Pluto:'♇',
  Ascendant:'↑', MC:'⊕',
}

function toPos(name: string, lonDeg: number): PlanetPos {
  const idx     = Math.floor(lonDeg / 30)
  const signDeg = lonDeg - idx * 30
  return {
    name,
    symbol: SYMBOLS[name] ?? name[0],
    lon:    lonDeg,
    sign:   SIGNS[idx],
    signDeg: Math.floor(signDeg),
    signMin: Math.round((signDeg % 1) * 60),
  }
}

// ─── natal chart ────────────────────────────────────────────────────────────

export function calcNatal(
  year: number, month: number, day: number,
  hourUT: number,
  latDeg: number, lonDeg: number
): PlanetPos[] {
  const jde = (julian as any).CalendarGregorianToJD(year, month, day + hourUT / 24)
  const T   = jcent(jde)
  const eps = 23.4392911 - 0.0130042 * T

  // GST → LST → Ascendant
  const gastSec = (sidereal as any).apparent(jde)
  const lst     = norm(gastSec * 15 / 3600 + lonDeg)
  const lstR    = lst * (Math.PI / 180)
  const latR    = latDeg * (Math.PI / 180)
  const epsR    = eps * (Math.PI / 180)
  const ascRaw  = norm(
    Math.atan2(-Math.cos(lstR), Math.sin(epsR) * Math.tan(latR) + Math.cos(epsR) * Math.sin(lstR))
    * (180 / Math.PI)
  )

  // MC
  const mcRaw = norm(
    Math.atan2(Math.sin(lstR), Math.cos(lstR) * Math.sin(epsR) + Math.tan(latR) * Math.cos(epsR))
    * (180 / Math.PI)
  )

  return [
    toPos('Sun',       norm((solar as any).apparentLongitude(T) * (180 / Math.PI))),
    toPos('Moon',      norm((moonposition as any).position(jde).lon * (180 / Math.PI))),
    toPos('Mercury',   geoLon(mercury, jde)),
    toPos('Venus',     geoLon(venus,   jde)),
    toPos('Mars',      geoLon(mars,    jde)),
    toPos('Jupiter',   geoLon(jupiter, jde)),
    toPos('Saturn',    geoLon(saturn,  jde)),
    toPos('Uranus',    geoLon(uranus,  jde)),
    toPos('Neptune',   geoLon(neptune, jde)),
    toPos('Pluto',     plutoLon(jde)),
    toPos('Ascendant', ascRaw),
    toPos('MC',        mcRaw),
  ]
}

// ─── current transits ───────────────────────────────────────────────────────

export function calcTransits(
  year: number, month: number, day: number, hourUT = 12
): PlanetPos[] {
  const jde = (julian as any).CalendarGregorianToJD(year, month, day + hourUT / 24)
  const T   = jcent(jde)
  return [
    toPos('Sun',     norm((solar as any).apparentLongitude(T) * (180 / Math.PI))),
    toPos('Moon',    norm((moonposition as any).position(jde).lon * (180 / Math.PI))),
    toPos('Mercury', geoLon(mercury, jde)),
    toPos('Venus',   geoLon(venus,   jde)),
    toPos('Mars',    geoLon(mars,    jde)),
    toPos('Jupiter', geoLon(jupiter, jde)),
    toPos('Saturn',  geoLon(saturn,  jde)),
    toPos('Uranus',  geoLon(uranus,  jde)),
    toPos('Neptune', geoLon(neptune, jde)),
    toPos('Pluto',   plutoLon(jde)),
  ]
}

// ─── aspect detection ────────────────────────────────────────────────────────

interface AspectDef {
  name: string
  angle: number
  orb: number
  quality: 'major' | 'minor'
}

const ASPECTS: AspectDef[] = [
  { name: 'Conjunction', angle:   0, orb: 8,  quality: 'major' },
  { name: 'Opposition',  angle: 180, orb: 8,  quality: 'major' },
  { name: 'Trine',       angle: 120, orb: 6,  quality: 'major' },
  { name: 'Square',      angle:  90, orb: 6,  quality: 'major' },
  { name: 'Sextile',     angle:  60, orb: 4,  quality: 'minor' },
]

function angularDiff(a: number, b: number): number {
  const d = Math.abs(a - b) % 360
  return d > 180 ? 360 - d : d
}

const TRANSIT_INTERP: Record<string, Record<string, string>> = {
  Saturn: {
    Saturn: "Saturn Return: the great life audit. Structures built on shaky ground dissolve; what is truly yours solidifies. A major rite of passage at ~29.",
    Sun:    "Saturn tests your identity and vitality. You're being asked to strip away what is performative and commit to authentic purpose.",
    Moon:   "Emotional responsibility and maturity are in focus. Old coping patterns are challenged; boundaries must be redefined.",
    Venus:  "Saturn disciplines relationships and finances. Commitments deepen or are released; what you value is measured against reality.",
    Mars:   "Sustained, disciplined effort replaces impulsive action. Saturn channels Mars energy toward long-term goals.",
    Mercury:"Serious, focused thought. Commitments in communication, writing, contracts, and agreements carry weight now.",
    Jupiter:"A reality check on expansion plans. Where ambition meets Saturn's discipline, lasting achievement is forged.",
    Ascendant: "You are redefining how the world sees you. Old personas feel restrictive; a more authentic presence emerges.",
  },
  Mars: {
    Sun:    "Transit Mars ignites your natal Sun: surge of will, physical energy, and drive. Initiation energy -- take action on what you have been preparing.",
    Mercury:"Mars fires up communication and thinking. Ideas become proposals; words carry extra force. Guard against hasty decisions.",
    Venus:  "Desire and passion are activated. Romantic energy peaks; financial boldness too. Act, but balance impulse with strategy.",
    Moon:   "Emotional reactivity heightens. Strong feelings propel you to act on what you have been suppressing.",
    Mars:   "Mars conjunct/opposite Mars marks a high-energy inflection -- competitive instincts peak; channel into initiative, not aggression.",
    Saturn: "Mars challenges your authority and discipline structures. Frustration if you push against rules -- opportunity if you direct effort strategically.",
    Jupiter:"Enthusiastic expansion. Take initiative on the goals you have been incubating -- the window for bold action is open.",
    Ascendant: "You project boldness and assertiveness into the world right now. Others notice your drive and directness.",
  },
  Pluto: {
    Sun:    "Pluto square the Sun is a deep identity transformation. Power struggles, ego deaths, and profound reinvention over several years.",
    Moon:   "Deep emotional excavation. Subconscious patterns surface to be transformed. Psychological intensity; potential for profound healing.",
    Mercury:"Pluto probes the depths of your mind. Obsessive thinking gives way to piercing insight. Research, therapy, and deep investigation are favored.",
    Venus:  "Pluto square Venus is among the most transformative relationship transits. Power dynamics, jealousy, and control surface to be resolved. Deep transformation of values and what you attract.",
    Mars:   "Compulsive or intensified drive. Sexual energy, power, and raw ambition are in focus. Avoid destructive power plays.",
    Jupiter:"Transformation of beliefs and expansion philosophy. Old ideologies dissolve as deeper truths emerge.",
    Saturn: "Pluto dismantles rigid authority structures -- both external and inner. What needs rebuilding from the foundation?",
    Uranus: "Generational: Pluto conjunct natal Uranus accelerates collective liberation and personal freedom drives. Sudden ruptures break open old limitations.",
    Neptune:"Generational: Pluto conjunct natal Neptune intensifies collective dissolution -- spiritual seeking, the collapse of illusions, and profound mystical opening.",
    Ascendant:"Pluto is transforming your entire self-presentation and physical presence. You emerge from this transit unrecognizable -- in the best sense.",
  },
  Neptune: {
    Moon:   "Neptune opposite your Moon dissolves emotional boundaries. Heightened empathy, sensitivity, and psychic receptivity -- but also confusion, escapism, and idealization in relationships.",
    Sun:    "Imagination and spiritual sensitivity expand. Boundaries of identity soften. Creative, artistic, and spiritual pursuits flourish.",
    Venus:  "Romantic idealism peaks. Beautiful, but Neptune's veil can obscure reality in love and finances. Seek clarity before committing.",
    Saturn: "Neptune erodes Saturn's structures gradually. Old commitments may feel increasingly uncertain. Spiritual insight dissolves rigid thinking.",
    Pluto:  "Neptune trine natal Pluto: generational spiritual-transformative energy flowing in harmony. Deep healing, compassion, and integration of the unconscious.",
    Mercury:"Intuitive and imaginative thinking. Logic gives way to inspiration, but watch for confusion and unclear communication.",
    Ascendant:"Self-image becomes fluid. Creative and spiritual identities emerge; beware losing yourself in others' expectations.",
  },
  Uranus: {
    Pluto:  "Uranus opposite natal Pluto: generational disruption of entrenched power patterns. Sudden liberation from deep-seated limitations.",
    Neptune:"Uranus trine natal Neptune: inspired innovation meets spiritual dissolution. Breakthroughs in consciousness and technology.",
    Sun:    "Electric awakening of identity. Life-changing freedom and individuation energy. Sudden opportunities, relocations, or reinventions.",
    Moon:   "Emotional freedom and unpredictability. Need for space and independence peaks. Exciting but potentially erratic in close relationships.",
    Venus:  "Excitement in love and creativity. Unconventional attractions; sudden relationship changes. Financial surprises.",
    Saturn: "Uranus challenges your authority structures. Rebellion against outdated rules; innovation breaks through old limitations.",
    MC:     "Uranus square the MC signals a major career and public image disruption. Unexpected professional changes, opportunities to break free from traditional paths.",
    Ascendant:"A dramatic shift in how you present to the world. Desire for freedom and authenticity overrides social expectations.",
  },
  Jupiter: {
    Neptune:"Jupiter opposite natal Neptune expands spiritual and imaginative horizons, but risks inflation of illusions. Ideal for study, travel, and visionary projects.",
    Sun:    "Jupiter brings optimism, growth, and opportunity to your core identity. Expansion, travel, and professional recognition.",
    Moon:   "Emotional generosity and warmth. Family and domestic life expand. Optimism elevates mood and social life.",
    Venus:  "Jupiter expands love, beauty, and financial opportunities. Abundance energy in relationships and creativity.",
    Saturn: "Jupiter's growth energy meets Saturn's discipline. Measured, sustained expansion. Good for formalized plans and legal matters.",
    Ascendant:"Confidence and social expansion. A year of positive first impressions and opening doors.",
  },
}

function getInterpretation(tPlanet: string, nPlanet: string, aspectName: string): string {
  const base =
    TRANSIT_INTERP[tPlanet]?.[nPlanet] ??
    TRANSIT_INTERP[tPlanet]?.['Sun'] ??
    `Transit ${tPlanet} forms a ${aspectName} with natal ${nPlanet}, activating ${nPlanet}'s themes through ${tPlanet}'s energy.`
  return base
}

export function calcAspects(natal: PlanetPos[], transits: PlanetPos[]): AspectInfo[] {
  const results: AspectInfo[] = []
  // Only include slow/personal planets as transit triggers (skip transit Moon for now)
  const transitPlanets = transits.filter(t => t.name !== 'Moon')
  // Only aspect natal personal + social + angle planets
  const natalTargets = natal.filter(n =>
    ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto','Ascendant','MC'].includes(n.name)
  )

  for (const t of transitPlanets) {
    for (const n of natalTargets) {
      const diff = angularDiff(t.lon, n.lon)
      for (const asp of ASPECTS) {
        const orb = Math.abs(diff - asp.angle)
        if (orb <= asp.orb) {
          // applying = transit moving toward exact (simplified: orb < 3 = consider applying)
          const applying = orb < 3
          results.push({
            transitPlanet:  t.name,
            natalPlanet:    n.name,
            aspect:         asp.name,
            angle:          asp.angle,
            orb:            Math.round(orb * 10) / 10,
            applying,
            quality:        asp.quality,
            interpretation: getInterpretation(t.name, n.name, asp.name),
          })
        }
      }
    }
  }

  // Sort: tightest orb first, then major before minor
  return results.sort((a, b) => {
    if (a.quality !== b.quality) return a.quality === 'major' ? -1 : 1
    return a.orb - b.orb
  })
}

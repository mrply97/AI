declare module 'astronomia' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const astronomia: any
  export = astronomia
  export const julian: any
  export const solar: any
  export const moonposition: any
  export const planetposition: any
  export const pluto: any
  export const sidereal: any
  export const nutation: any
  export const coord: any
}

declare module 'astronomia/data/vsop87Bearth'   { const d: any; export default d }
declare module 'astronomia/data/vsop87Bmercury' { const d: any; export default d }
declare module 'astronomia/data/vsop87Bvenus'   { const d: any; export default d }
declare module 'astronomia/data/vsop87Bmars'    { const d: any; export default d }
declare module 'astronomia/data/vsop87Bjupiter' { const d: any; export default d }
declare module 'astronomia/data/vsop87Bsaturn'  { const d: any; export default d }
declare module 'astronomia/data/vsop87Buranus'  { const d: any; export default d }
declare module 'astronomia/data/vsop87Bneptune' { const d: any; export default d }

// Muhammet Furkan Yılmaz, 2024502108
// What only TypeScript adds (topics T1 to T5). See the handout.

// T1 (worked example): `{ a: string }` inside a pattern is a RENAME, not a type.
const point = { x: 1, y: 2 }
const { x: horizontal } = point // x is renamed to horizontal; there is no variable x
// Putting the type after the whole pattern is the right way:
const { y: vertical }: { x: number; y: number } = point
console.log('T1:', horizontal, vertical) // T1: 1 2

// T2: a tuple return type `[number, string]` vs `as const` on an array literal.
function getCampCheckpoint(): [number, string] {
  return [2850, 'Dilberdüzü']
}
const [campAltitude, campTitle] = getCampCheckpoint() // types: number, string

const fixedStages = ['Base', 'High Camp', 'Summit'] as const // readonly ['Base', 'High Camp', 'Summit']
const [firstStage, secondStage] = fixedStages // literal types: 'Base' and 'High Camp' (never undefined)
console.log('T2:', campAltitude, campTitle, '|', firstStage, secondStage)

// T3: noUncheckedIndexedAccess — `const [first] = items` has type `T | undefined`.
const gearList: string[] = ['Ice Axe', 'Crampons']
const [firstGear] = gearList // type is `string | undefined`
const safeFirstGear = firstGear !== undefined ? firstGear.toUpperCase() : 'NONE'
const [guaranteedGear = 'Helmet'] = gearList // default removes `undefined`, type is `string`
console.log('T3:', safeFirstGear, '|', guaranteedGear)

// T4: defaults and optional fields — optional gives `T | undefined`, default narrows to `T`.
type GearConfig = { helmet?: boolean; crampons?: boolean }
const config: GearConfig = { helmet: true }
const { helmet, crampons = false } = config
// `helmet` has type `boolean | undefined`; `crampons` has type `boolean`.
console.log('T4:', typeof helmet, helmet, '|', typeof crampons, crampons)

// T5: one compile error that destructuring causes, suppressed with // @ts-expect-error.
const summitRecord = { peak: 'Erciyes', elevation: 3917 }
// @ts-expect-error Property 'weather' does not exist on type '{ peak: string; elevation: number; }'.
const { weather } = summitRecord
// Fix: include optional `weather?: string` in the source type before destructuring.
const typedSummit: { peak: string; elevation: number; weather?: string } = summitRecord
const { weather: fixedWeather = 'Clear' } = typedSummit
console.log('T5:', weather, '| fixed:', fixedWeather)
// Muhammet Furkan Yılmaz, 2024502108
// Forms 11 and 12 in TypeScript, and the typing rules for patterns in parameters.

type TaskInput = { title: string; status?: 'todo' | 'done' }

// Form 11 (worked example + custom domain example): the type goes after the whole pattern.
function createTask({ title, status = 'todo' }: TaskInput) {
  return { title, status }
}
console.log('form 11 (starter):', createTask({ title: 'Read' }))

type ExpeditionInput = {
  peak?: string
  days?: number
  winterGear?: boolean
}

function planExpedition({
  peak = 'Aladağlar Demirkazık',
  days = 2,
  winterGear = false
}: ExpeditionInput = {}): string {
  return `${peak} (${days}d, winter=${winterGear})`
}
console.log('form 11 (route):', planExpedition({ peak: 'Erciyes', days: 3 }))
console.log('form 11 (empty call):', planExpedition())

// Form 11b: typed tuple parameter with optional third item
function formatGpsPoint([lat, lon, alt = 0]: [number, number, number?]): string {
  return `lat:${lat.toFixed(2)}, lon:${lon.toFixed(2)}, alt:${alt}m`
}
console.log('form 11b:', formatGpsPoint([40.835, 41.161, 3932]))

// Form 12: typed loops over Object.entries and Map
const packWeights: Record<string, number> = { tent: 1850, stove: 320, rope: 4100 }
const weightSummary: string[] = []
for (const [item, grams] of Object.entries(packWeights)) {
  weightSummary.push(`${item}:${grams}g`)
}
console.log('form 12 (Object.entries):', weightSummary.join(', '))

const campElevations = new Map<string, number>([
  ['Dilberdüzü', 2850],
  ['Deniz Gölü', 3380]
])
const campSummary: string[] = []
for (const [camp, meters] of campElevations) {
  campSummary.push(`${camp}@${meters}m`)
}
console.log('form 12 (Map):', campSummary.join(' -> '))
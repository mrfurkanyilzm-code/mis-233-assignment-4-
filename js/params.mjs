// Muhammet Furkan Yılmaz, 2024502108
// Destructuring in parameters and loops (forms 11 and 12). Run with `node js/params.mjs`.

// Form 11 (worked example + custom domain example): an options object in the parameter list, with defaults.
function createTask({ title, status = 'todo' } = {}) {
  return { title, status }
}
console.log('form 11 (starter):', createTask({ title: 'Read' }))

function planExpedition({ peak = 'Aladağlar Demirkazık', days = 2, winterGear = false } = {}) {
  return `${peak} (${days}d, winter=${winterGear})`
}
console.log('form 11 (route):', planExpedition({ peak: 'Erciyes', days: 3 }))
console.log('form 11 (empty call):', planExpedition())

// Form 11b: the same idea with an array parameter, ([lat, lon, alt]) => ...
function formatGpsPoint([lat, lon, alt = 0]) {
  return `lat:${lat.toFixed(2)}, lon:${lon.toFixed(2)}, alt:${alt}m`
}
console.log('form 11b:', formatGpsPoint([40.835, 41.161, 3932]))

// Form 12: loops over entries, for (const [key, value] of Object.entries(obj)) and a Map
const packWeights = { tent: 1850, stove: 320, rope: 4100 }
const weightSummary = []
for (const [item, grams] of Object.entries(packWeights)) {
  weightSummary.push(`${item}:${grams}g`)
}
console.log('form 12 (Object.entries):', weightSummary.join(', '))

const campElevations = new Map([
  ['Dilberdüzü', 2850],
  ['Deniz Gölü', 3380]
])
const campSummary = []
for (const [camp, meters] of campElevations) {
  campSummary.push(`${camp}@${meters}m`)
}
console.log('form 12 (Map):', campSummary.join(' -> '))
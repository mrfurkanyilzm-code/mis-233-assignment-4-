// Muhammet Furkan Yılmaz, 2024502108
// Bonus 2: Depth — iterables, evaluation order, assignment targets, and type-level destructuring.

// 1. Destructuring any Iterable (string, Set, generator) via the [Symbol.iterator] protocol
const peakCode = 'KACKAR'
const [firstLetter, secondLetter, ...remainingLetters] = peakCode
console.log('B2.1 string:', firstLetter, secondLetter, remainingLetters)

const uniqueCamps = new Set(['Yukarı Kavrun', 'Dilberdüzü', 'Deniz Gölü', 'Dilberdüzü'])
const [camp1, camp2] = uniqueCamps
console.log('B2.1 Set:', camp1, '|', camp2)

function* elevationGenerator(start: number, step: number): Generator<number> {
  let current = start
  while (true) {
    yield current
    current += step
  }
}
// Array destructuring pulls only 3 values and calls .return() to close the infinite generator
const [alt1, alt2, alt3] = elevationGenerator(2000, 450)
console.log('B2.1 generator:', alt1, alt2, alt3)

// 2. Evaluation order & lazy defaults with side effects
let defaultEvalCount = 0
function computeFallbackAltitude(): number {
  defaultEvalCount += 1
  return 1500
}
const [knownAlt = computeFallbackAltitude(), unknownAlt = computeFallbackAltitude()] = [2850]
console.log('B2.2 lazy default count:', defaultEvalCount, 'values:', knownAlt, unknownAlt)

// Left-to-right binding: a later default can reference an earlier variable in the same pattern
const [baseCampAlt = 1800, highCampAlt = baseCampAlt + 1050] = []
console.log('B2.2 sequential defaults:', baseCampAlt, highCampAlt)

// 3. Destructuring into existing object properties & for...in vs for...of pitfall
const summitCoords = { lat: 0, lon: 0 }
;[summitCoords.lat, summitCoords.lon] = [40.835, 41.161]
console.log('B2.3 property target:', summitCoords)

const sampleStages = ['Base', 'Ridge']
const forInPairs: string[] = []
for (const key in sampleStages) {
  // key is a string index ('0', '1'); destructuring it iterates over its characters!
  const [ch0, ch1] = key
  forInPairs.push(`${String(ch0)}:${String(ch1)}`)
}
console.log('B2.3 for...in string destructure:', forInPairs)

// 4. Type-level destructuring with `infer` and `Parameters<F>`
type Head<T extends readonly unknown[]> = T extends readonly [infer First, ...unknown[]]
  ? First
  : never
type Tail<T extends readonly unknown[]> = T extends readonly [unknown, ...infer Rest]
  ? Rest
  : never

type ExpeditionTuple = [peak: string, elevation: number, winter: boolean]
type FirstField = Head<ExpeditionTuple> // string
type RemainingFields = Tail<ExpeditionTuple> // [number, boolean]

function logRoute(code: string, meters: number): string {
  return `${code}@${meters}m`
}
type FirstLogParam = Parameters<typeof logRoute>[0] // string

const tupleSample: ExpeditionTuple = ['Kaçkar', 3932, true]
const [headVal, ...tailVals]: ExpeditionTuple = tupleSample
const typedCode: FirstLogParam = headVal
console.log('B2.4 type-level infer:', typedCode, tailVals)
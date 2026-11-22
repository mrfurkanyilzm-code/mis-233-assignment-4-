// Muhammet Furkan Yılmaz, 2024502108
// The same four array forms as js/arrays.mjs, now typed. Run with `npx tsx ts/arrays.ts`.

// Form 1 (worked example + custom tuple function): the return type of the function is a tuple.
function minMax(numbers: number[]): [number, number] {
  return [Math.min(...numbers), Math.max(...numbers)]
}
const [lowest, highest] = minMax([4, 9, 2])
console.log('form 1 (starter):', lowest, highest) // form 1 (starter): 2 9

function routeElevationSpan(start: number, summit: number): [number, number] {
  return [start, summit]
}
const [startAlt, summitAlt] = routeElevationSpan(1650, 3932)
console.log('form 1 (route):', startAlt, summitAlt)

// Form 2: skip an item and collect the rest, [, second, ...others]
const stages: string[] = ['Dilberdüzü Base', 'Deniz Gölü Camp', 'North Ridge', 'Summit Push']
const [, secondStage, ...remainingStages] = stages
// With noUncheckedIndexedAccess, secondStage has type `string | undefined`
console.log('form 2:', secondStage ?? 'Unknown', remainingStages)

// Form 3: swap two variables without a temporary, [a, b] = [b, a]
let leadClimber: string = 'Furkan'
let belayer: string = 'Mert'
;[leadClimber, belayer] = [belayer, leadClimber]
console.log('form 3:', leadClimber, belayer)

// Form 4: default values, const [a = 1, b = 2] = []
const providedRopes: [string?] = ['70m Dry Rope']
const [primaryRope = '60m Dynamic', backupRope = '30m Static'] = providedRopes
console.log('form 4:', primaryRope, '|', backupRope)
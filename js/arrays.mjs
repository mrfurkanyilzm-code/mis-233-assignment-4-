// Muhammet Furkan Yılmaz, 2024502108
// Array destructuring (forms 1 to 4). Plain JavaScript: run with `node js/arrays.mjs`.

// Form 1 (worked example + custom domain example): take values out of an array by position.
function minMax(numbers) {
  return [Math.min(...numbers), Math.max(...numbers)]
}
const [lowest, highest] = minMax([4, 9, 2])
console.log('form 1 (starter):', lowest, highest) // form 1 (starter): 2 9

function routeAltitudeSpan(checkpoints) {
  return [checkpoints[0], checkpoints[checkpoints.length - 1]]
}
const [startAlt, summitAlt] = routeAltitudeSpan([1650, 2400, 3150, 3932])
console.log('form 1 (route):', startAlt, summitAlt) // form 1 (route): 1650 3932

// Form 2: skip an item and collect the rest, [, second, ...others]
const stages = ['Dilberdüzü Base', 'Deniz Gölü Camp', 'North Ridge', 'Summit Push']
const [, secondStage, ...remainingStages] = stages
console.log('form 2:', secondStage, remainingStages)
// form 2: Deniz Gölü Camp [ 'North Ridge', 'Summit Push' ]

// Form 3: swap two variables without a temporary, [a, b] = [b, a]
let leadClimber = 'Furkan'
let belayer = 'Mert'
;[leadClimber, belayer] = [belayer, leadClimber]
console.log('form 3:', leadClimber, belayer) // form 3: Mert Furkan

// Form 4: default values, const [a = 1, b = 2] = []
const providedRopes = ['70m Dry Rope']
const [primaryRope = '60m Dynamic', backupRope = '30m Static'] = providedRopes
const [missingFirst = 'Helmet', missingSecond = 'Harness'] = [undefined, 'Chalk Bag']
console.log('form 4:', primaryRope, '|', backupRope, '|', missingFirst, '|', missingSecond)
// form 4: 70m Dry Rope | 30m Static | Helmet | Chalk Bag
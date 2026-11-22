// Muhammet Furkan Yılmaz, 2024502108
// Things that surprise people. Run with `node js/pitfalls.mjs`.

// Pitfall 1 (worked example): destructuring undefined or null throws a TypeError.
try {
  const { a } = undefined
  console.log(a)
} catch (error) {
  console.log('pitfall 1:', error.constructor.name) // pitfall 1: TypeError
}

// Pitfall 2: a default only applies to undefined, not to null
const weatherReport = { visibilityKm: null, windKnots: undefined }
const { visibilityKm = 10, windKnots = 12 } = weatherReport
console.log('pitfall 2:', { visibilityKm, windKnots })
// pitfall 2: { visibilityKm: null, windKnots: 12 }

// Pitfall 3: assigning without const/let needs parentheses, ({ a } = obj)
try {
  new Function('let peak; { peak } = { peak: "Süphan" }')
} catch (error) {
  console.log('pitfall 3 (without parens):', error.constructor.name) // SyntaxError
}
let existingPeak = 'Old Peak'
;({ peak: existingPeak } = { peak: 'Süphan' })
console.log('pitfall 3 (with parens):', existingPeak) // Süphan

// Pitfall 4: it copies references, not deep copies (nested objects are shared)
const originalTrip = { title: 'Kaçkar', gear: ['Axe', 'Helmet'] }
const { gear: sharedGear } = originalTrip
sharedGear.push('Crampons')
console.log('pitfall 4 (original mutated):', originalTrip.gear)
// pitfall 4 (original mutated): [ 'Axe', 'Helmet', 'Crampons' ]

// Pitfall 5: in objects the order does not matter, in arrays it does
const campObj = { first: 'Base Camp', second: 'Summit Camp' }
const { second: objSecond, first: objFirst } = campObj
const campArr = ['Base Camp', 'Summit Camp']
const [arrSecond, arrFirst] = campArr
console.log('pitfall 5 (object):', objFirst, '|', objSecond)
console.log('pitfall 5 (array):', arrFirst, '|', arrSecond)
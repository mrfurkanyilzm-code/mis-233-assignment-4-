// Muhammet Furkan Yılmaz, 2024502108
// Object destructuring (forms 5 to 10). Run with `node js/objects.mjs`.

// Form 5 (worked example + custom domain example): take properties out of an object by name.
const task = { id: 't1', title: 'Buy milk', status: 'todo' }
const { title, status } = task
console.log('form 5 (starter):', title, status) // form 5 (starter): Buy milk todo

const route = {
  code: 'KCK-04',
  peak: 'Kaçkar North Face',
  grade: 'AD+',
  elevation: 3932
}
const { peak, elevation } = route
console.log('form 5 (route):', peak, elevation) // form 5 (route): Kaçkar North Face 3932

// Form 6: rename while you take it, { peak: summitName }
const { peak: summitName, elevation: meters } = route
console.log('form 6:', summitName, meters) // form 6: Kaçkar North Face 3932

// Form 7: default values, { permitRequired = false }
const { permitRequired = false, grade = 'F' } = route
console.log('form 7:', permitRequired, grade) // form 7: false AD+

// Form 8: rest, { code, ...routeDetails }
const { code, ...routeDetails } = route
console.log('form 8:', code, routeDetails)
// form 8: KCK-04 { peak: 'Kaçkar North Face', grade: 'AD+', elevation: 3932 }

// Form 9: nested patterns, { leader: { name } } and arrays inside objects
const expedition = {
  id: 'EXP-2026',
  leader: { name: 'Furkan', club: 'BÜDAK' },
  camps: ['Yukarı Kavrun', 'Dilberdüzü', 'Deniz Gölü']
}
const {
  leader: { name: leaderName, club },
  camps: [firstCamp, ...upperCamps]
} = expedition
console.log('form 9:', leaderName, club, firstCamp, upperCamps)
// form 9: Furkan BÜDAK Yukarı Kavrun [ 'Dilberdüzü', 'Deniz Gölü' ]

// Form 10: computed key, { [key]: value }
const selectedField = 'grade'
const { [selectedField]: chosenGrade } = route
console.log('form 10:', chosenGrade) // form 10: AD+
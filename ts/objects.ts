// Muhammet Furkan Yılmaz, 2024502108
// The same six object forms as js/objects.mjs, now typed.

type Task = { id: string; title: string; status: 'todo' | 'in-progress' | 'done' }

// Form 5 (worked example + custom Route type)
const task: Task = { id: 't1', title: 'Buy milk', status: 'todo' }
const { title, status } = task
console.log('form 5 (starter):', title, status) // form 5 (starter): Buy milk todo

type Route = {
  code: string
  peak: string
  grade: string
  elevation: number
  permitRequired?: boolean
}

const route: Route = {
  code: 'KCK-04',
  peak: 'Kaçkar North Face',
  grade: 'AD+',
  elevation: 3932
}
const { peak, elevation } = route
console.log('form 5 (route):', peak, elevation)

// Form 6: rename while you take it, { peak: summitName }
const { peak: summitName, elevation: meters } = route
console.log('form 6:', summitName, meters)

// Form 7: default values, { permitRequired = false }
const { permitRequired = false } = route
console.log('form 7:', permitRequired)

// Form 8: rest, { code, ...routeDetails }
const { code, ...routeDetails } = route
console.log('form 8:', code, routeDetails)

// Form 9: nested patterns, { leader: { name } } and arrays inside objects
type Expedition = {
  id: string
  leader: { name: string; club: string }
  camps: [string, ...string[]]
}

const expedition: Expedition = {
  id: 'EXP-2026',
  leader: { name: 'Furkan', club: 'BÜDAK' },
  camps: ['Yukarı Kavrun', 'Dilberdüzü', 'Deniz Gölü']
}
const {
  leader: { name: leaderName, club },
  camps: [firstCamp, ...upperCamps]
} = expedition
console.log('form 9:', leaderName, club, firstCamp, upperCamps)

// Form 10: computed key, { [key]: value }
const selectedField: 'grade' | 'peak' = 'grade'
const { [selectedField]: chosenGrade } = route
console.log('form 10:', chosenGrade)
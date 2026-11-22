# Destructuring Field Guide

Name: Muhammet Furkan Yılmaz  
Student number: 2024502108

Bonuses claimed: **Bonus 1: LaTeX**, **Bonus 2: Depth**, **Bonus 3: Real code**, **Bonus 4: Git repository**

## Run

```bash
npm install
npm run all      # runs the JS and TS examples
npm run check    # type-checks in strict mode
```

All outputs shown in this guide come directly from `npm run all > output.txt` on Node.js / `tsx`.

---

## Field guide

> **Plain assignments vs. destructuring & rest vs. spread:** Every destructuring pattern is shorthand for sequential property or index lookups (`const x = arr[0]`, `const peak = route.peak`). Also note that `...rest` inside a destructuring pattern **collects** remaining items into a new array or object, whereas `...spread` inside an expression **expands** an array or object into individual elements or properties—the same three dots perform opposite jobs depending on which side of `=` they appear on.

### Form 1: array destructuring by position, `const [x, y] = f()`

**Syntax:** `const [startAlt, summitAlt] = routeAltitudeSpan(checkpoints)`

**Example** (from `js/arrays.mjs`):

```js
function routeAltitudeSpan(checkpoints) {
  return [checkpoints[0], checkpoints[checkpoints.length - 1]]
}
const [startAlt, summitAlt] = routeAltitudeSpan([1650, 2400, 3150, 3932])
console.log('form 1 (route):', startAlt, summitAlt)
```

**Output:** `form 1 (route): 1650 3932`

**Use it when:** a function returns a fixed-order pair or tuple (such as `[min, max]` or `[start, summit]`) and you want named variables immediately instead of `span[0]` and `span[1]`.

**Watch out:** position is everything; swapping the variable names silently swaps their values, and if the array is shorter than the pattern, extra variables become `undefined`.

---

### Form 2: skip an item and collect the rest, `const [, second, ...others] = list`

**Syntax:** `const [, secondStage, ...remainingStages] = stages`

**Example** (from `js/arrays.mjs`):

```js
const stages = ['Dilberdüzü Base', 'Deniz Gölü Camp', 'North Ridge', 'Summit Push']
const [, secondStage, ...remainingStages] = stages
console.log('form 2:', secondStage, remainingStages)
```

**Output:** `form 2: Deniz Gölü Camp [ 'North Ridge', 'Summit Push' ]`

**Use it when:** you need to ignore leading elements (like a header row or base camp) and capture the rest as a fresh array (`stages.slice(2)`).

**Watch out:** `...remainingStages` must be the **last** element in the array pattern (`SyntaxError: Rest element must be last element` otherwise), and under `noUncheckedIndexedAccess` in TypeScript, `secondStage` has type `string | undefined`.

---

### Form 3: swap two variables without a temporary, `[a, b] = [b, a]`

**Syntax:** `[leadClimber, belayer] = [belayer, leadClimber]`

**Example** (from `js/arrays.mjs`):

```js
let leadClimber = 'Furkan'
let belayer = 'Mert'
;[leadClimber, belayer] = [belayer, leadClimber]
console.log('form 3:', leadClimber, belayer)
```

**Output:** `form 3: Mert Furkan`

**Use it when:** rotating roles or reordering two `let` variables in place without declaring a `temp` variable.

**Watch out:** both variables must be declared with `let` (not `const`), and if you omit semicolons, start the line with `;[` so JavaScript does not parse `[` as indexing into the previous line.

---

### Form 4: default values in arrays, `const [a = 1, b = 2] = []`

**Syntax:** `const [primaryRope = '60m Dynamic', backupRope = '30m Static'] = providedRopes`

**Example** (from `js/arrays.mjs`):

```js
const providedRopes = ['70m Dry Rope']
const [primaryRope = '60m Dynamic', backupRope = '30m Static'] = providedRopes
const [missingFirst = 'Helmet', missingSecond = 'Harness'] = [undefined, 'Chalk Bag']
console.log('form 4:', primaryRope, '|', backupRope, '|', missingFirst, '|', missingSecond)
```

**Output:** `form 4: 70m Dry Rope | 30m Static | Helmet | Chalk Bag`

**Use it when:** an array may have fewer items than expected or explicit `undefined` slots, and you want safe fallback values (`arr[1] !== undefined ? arr[1] : '30m Static'`).

**Watch out:** defaults trigger **only** when the slot is missing or strictly `undefined`; passing `null` or `''` keeps `null` or `''`.

---

### Form 5: properties by name, `let { a, b } = t`

**Syntax:** `const { peak, elevation } = route`

**Example** (from `js/objects.mjs`):

```js
const route = {
  code: 'KCK-04',
  peak: 'Kaçkar North Face',
  grade: 'AD+',
  elevation: 3932
}
const { peak, elevation } = route
console.log('form 5 (route):', peak, elevation)
```

**Output:** `form 5 (route): Kaçkar North Face 3932`

**Use it when:** extracting multiple fields from a record (`const peak = route.peak; const elevation = route.elevation`) where the property names already match the variable names you want.

**Watch out:** property order in `{ elevation, peak }` does not matter, unlike arrays, because lookup is by key name; misspelling a key produces `undefined` in JS and a compile error in TS.

---

### Form 6: rename while you take it, `const { a: alpha } = t`

**Syntax:** `const { peak: summitName, elevation: meters } = route`

**Example** (from `js/objects.mjs`):

```js
const { peak: summitName, elevation: meters } = route
console.log('form 6:', summitName, meters)
```

**Output:** `form 6: Kaçkar North Face 3932`

**Use it when:** a property name collides with an existing local variable or is too generic in the current scope.

**Watch out:** the left side of `:` is the **source property** and the right side is the **new local variable**; `peak` is not bound in scope, and in TypeScript `{ peak: string }` inside a pattern renames `peak` to a variable named `string` rather than annotating its type.

---

### Form 7: default values in objects, `const { a = 1 } = t`

**Syntax:** `const { permitRequired = false, grade = 'F' } = route`

**Example** (from `js/objects.mjs`):

```js
const { permitRequired = false, grade = 'F' } = route
console.log('form 7:', permitRequired, grade)
```

**Output:** `form 7: false AD+`

**Use it when:** reading optional configuration fields (`route.permitRequired === undefined ? false : route.permitRequired`) so downstream code never has to handle `undefined`.

**Watch out:** just like array defaults, an explicit `null` on the object does **not** fall back to the default value—it stays `null`.

---

### Form 8: rest in an object, `const { a, ...others } = t`

**Syntax:** `const { code, ...routeDetails } = route`

**Example** (from `js/objects.mjs`):

```js
const { code, ...routeDetails } = route
console.log('form 8:', code, routeDetails)
```

**Output:** `form 8: KCK-04 { peak: 'Kaçkar North Face', grade: 'AD+', elevation: 3932 }`

**Use it when:** stripping out one or two control fields (such as `id`, `code`, or `children`) and forwarding the remaining own enumerable properties as a shallow-cloned object.

**Watch out:** `routeDetails` is a **shallow** copy—nested objects or arrays inside it still share references with the original object.

---

### Form 9: nested patterns and arrays inside objects, `const { p: { x }, list: [first] } = t`

**Syntax:** `const { leader: { name: leaderName, club }, camps: [firstCamp, ...upperCamps] } = expedition`

**Example** (from `js/objects.mjs`):

```js
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
```

**Output:** `form 9: Furkan BÜDAK Yukarı Kavrun [ 'Dilberdüzü', 'Deniz Gölü' ]`

**Use it when:** unpacking a known, fixed-shape response object one or two levels deep in a single clear statement.

**Watch out:** if an intermediate property like `expedition.leader` is `undefined` or `null`, destructuring throws a `TypeError` immediately; also, `leader` itself is not bound as a variable—only `leaderName` and `club` are.

---

### Form 10: computed key, `const { [key]: value } = t`

**Syntax:** `const { [selectedField]: chosenGrade } = route`

**Example** (from `js/objects.mjs`):

```js
const selectedField = 'grade'
const { [selectedField]: chosenGrade } = route
console.log('form 10:', chosenGrade)
```

**Output:** `form 10: AD+`

**Use it when:** the property name to extract is stored in a variable or expression at runtime (`const chosenGrade = route[selectedField]`).

**Watch out:** a computed key **must** include `: targetVariable` because JavaScript cannot derive a static identifier name from a dynamic bracket expression.

---

### Form 11: patterns in parameters with defaults, `function f({ a = 1, b }: Options = {})`

**Syntax:** `function planExpedition({ peak = 'Aladağlar Demirkazık', days = 2, winterGear = false } = {})`

**Example** (from `js/params.mjs`):

```js
function planExpedition({ peak = 'Aladağlar Demirkazık', days = 2, winterGear = false } = {}) {
  return `${peak} (${days}d, winter=${winterGear})`
}
console.log('form 11 (route):', planExpedition({ peak: 'Erciyes', days: 3 }))
console.log('form 11 (empty call):', planExpedition())
```

**Output:**
```text
form 11 (route): Erciyes (3d, winter=false)
form 11 (empty call): Aladağlar Demirkazık (2d, winter=false)
```

**Use it when:** designing functions or React components that accept an options object where callers may omit individual fields or call `planExpedition()` with no arguments at all.

**Watch out:** you need **both** inner property defaults (`days = 2`) and the outer parameter default (`= {}`); without `= {}`, calling `planExpedition()` with zero arguments throws `TypeError: Cannot destructure property 'peak' of 'undefined'`.

---

### Form 12: patterns in loops, `for (const [k, v] of Object.entries(o))` and `Map`

**Syntax:** `for (const [item, grams] of Object.entries(packWeights))`

**Example** (from `js/params.mjs`):

```js
const packWeights = { tent: 1850, stove: 320, rope: 4100 }
const weightSummary = []
for (const [item, grams] of Object.entries(packWeights)) {
  weightSummary.push(`${item}:${grams}g`)
}
console.log('form 12 (Object.entries):', weightSummary.join(', '))
```

**Output:** `form 12 (Object.entries): tent:1850g, stove:320g, rope:4100g`

**Use it when:** iterating over `[key, value]` pairs from `Object.entries()`, `Map` instances, or `.entries()` on arrays instead of indexing `entry[0]` and `entry[1]`.

**Watch out:** `for...of` works on iterables (`Object.entries(obj)`, `Map`), whereas `for...in` iterates over string property keys and cannot destructure `[key, value]` pairs from a plain object.

---

## Pitfalls

1. **Destructuring `undefined` or `null` throws a `TypeError`** (`js/pitfalls.mjs`):
   ```js
   try {
     const { a } = undefined
   } catch (error) {
     console.log('pitfall 1:', error.constructor.name)
   }
   ```
   **Output:** `pitfall 1: TypeError`  
   **Why:** Destructuring attempts to coerce the right-hand side into an object (or look up `[Symbol.iterator]`), and neither `undefined` nor `null` can be converted to an object in JavaScript.

2. **Default values trigger on `undefined`, never on `null`** (`js/pitfalls.mjs`):
   ```js
   const weatherReport = { visibilityKm: null, windKnots: undefined }
   const { visibilityKm = 10, windKnots = 12 } = weatherReport
   console.log('pitfall 2:', { visibilityKm, windKnots })
   ```
   **Output:** `pitfall 2: { visibilityKm: null, windKnots: 12 }`  
   **Why:** JavaScript's destructuring specification checks `value === undefined` strictly before evaluating a default initializer, treating `null` as an intentional present value.

3. **Reassigning existing variables with `{ ... }` requires parentheses** (`js/pitfalls.mjs`):
   ```js
   let existingPeak = 'Old Peak'
   ;({ peak: existingPeak } = { peak: 'Süphan' })
   console.log('pitfall 3 (with parens):', existingPeak)
   ```
   **Output:** `pitfall 3 (without parens): SyntaxError` / `pitfall 3 (with parens): Süphan`  
   **Why:** A statement starting with `{` is parsed by JavaScript as a block statement rather than an object destructuring assignment pattern unless wrapped in `(...)`.

4. **Destructuring copies references, not deep clones** (`js/pitfalls.mjs`):
   ```js
   const originalTrip = { title: 'Kaçkar', gear: ['Axe', 'Helmet'] }
   const { gear: sharedGear } = originalTrip
   sharedGear.push('Crampons')
   console.log('pitfall 4 (original mutated):', originalTrip.gear)
   ```
   **Output:** `pitfall 4 (original mutated): [ 'Axe', 'Helmet', 'Crampons' ]`  
   **Why:** Both `const { gear } = originalTrip` and rest (`...others`) perform shallow assignments, so nested arrays and objects still point to the exact same heap reference.

5. **Object destructuring matches by key name; array destructuring matches by index** (`js/pitfalls.mjs`):
   ```js
   const campObj = { first: 'Base Camp', second: 'Summit Camp' }
   const { second: objSecond, first: objFirst } = campObj
   const campArr = ['Base Camp', 'Summit Camp']
   const [arrSecond, arrFirst] = campArr
   ```
   **Output:** `pitfall 5 (object): Base Camp | Summit Camp` and `pitfall 5 (array): Summit Camp | Base Camp`  
   **Why:** Objects are unordered key-value maps resolved by property name, while arrays are ordered sequences resolved strictly by positional index `0, 1, ...`.

---

## Props and children

In React, every component function receives **one single argument**: an object called `props`. Attributes written on a JSX tag (`title="Kaçkar"`) and content placed between opening and closing tags (`<Card>Ridge route</Card>`) are merged into that same `props` object—the tag body simply becomes `props.children`.

### P1: Props is one object (`CardA(props)` vs `CardB({ title, children })`)

```tsx
function CardA(props: CardProps) {
  return <section><h2>{props.title}</h2>{props.children}</section>
}
function CardB({ title, children }: CardProps) {
  return <section><h2>{title}</h2>{children}</section>
}
```

**Output:**
```html
P1 A: <section><h2>Hi</h2>text</section>
P1 B: <section><h2>Hi</h2>text</section>
```

**Explanation:** `CardB` combines **Form 11** (destructured function parameter) and **Form 5** (object property extraction by name) on the single `props` object React passes to `CardB(props)`.

### P2: `children` is only a prop

```tsx
renderToStaticMarkup(<CardB title="Kaçkar">Ridge route</CardB>)
renderToStaticMarkup(<CardB children="Ridge route" title="Kaçkar"/>)
```

**Output:**
```html
P2 tag body: <section><h2>Kaçkar</h2>Ridge route</section>
P2 prop attr: <section><h2>Kaçkar</h2>Ridge route</section>
```

**Explanation:** JSX compiles `<CardB title="Kaçkar">Ridge route</CardB>` into `jsx(CardB, { title: "Kaçkar", children: "Ridge route" })`. Passing `children` as an explicit attribute produces the exact same `props` object and HTML output.

### P3: What `children` can be

Testing all eight types in `js/props.jsx` with `renderToStaticMarkup(<Slot label={...}>{value}</Slot>)`:

| Input passed as `children` | Real rendered HTML output | Appears in DOM? |
|---|---|---|
| `"Base camp"` (string) | `<div data-case="string">Base camp</div>` | Yes (text node) |
| `{3932}` (number) | `<div data-case="number">3932</div>` | Yes (text node `"3932"`) |
| `<span>Alpine</span>` (1 element) | `<div data-case="one-el"><span>Alpine</span></div>` | Yes (single element) |
| `<span>Day 1</span><span>Day 2</span>` | `<div data-case="multi-el"><span>Day 1</span><span>Day 2</span></div>` | Yes (array of elements) |
| `{undefined}` | `<div data-case="undef"></div>` | No (ignored) |
| `{null}` | `<div data-case="null"></div>` | No (ignored) |
| `{false}` | `<div data-case="false"></div>` | No (ignored — enables `{isReady && <Badge />}`) |
| `{() => 'ignored'}` (function) | `<div data-case="fn"></div>` + console warning | No (React logs warning and skips it) |

### P4: Separating `children` from other props and spread order

```tsx
function RoutePanelRestFirst({ title, children, ...rest }: RoutePanelProps) {
  return <section className="panel-default" {...rest}><h3>{title}</h3>{children}</section>
}
function RoutePanelRestLast({ title, children, ...rest }: RoutePanelProps) {
  return <section {...rest} className="panel-forced"><h3>{title}</h3>{children}</section>
}
```

**Output:**
```html
P4 rest-wins: <section class="panel-custom" id="route-1"><h3>Aladağlar</h3><p>2 days</p></section>
P4 explicit-wins: <section id="route-1" class="panel-forced"><h3>Aladağlar</h3><p>2 days</p></section>
```

**Explanation:** Extracting `title` and `children` first prevents invalid DOM attributes or duplicate children from leaking onto `<section>`. In JSX, later props overwrite earlier ones: `{...rest}` placed *after* `className="panel-default"` lets caller props override defaults, whereas `{...rest}` placed *before* `className="panel-forced"` enforces the component's own class.

### P5: Props or `children`?

```tsx
<ExpeditionWithProps header={<h2>Erciyes</h2>} summary="North ridge" footer="3917m" />
<ExpeditionWithChildren><header><h2>Erciyes</h2></header><p>North ridge</p><footer>3917m</footer></ExpeditionWithChildren>
```

**Output:**
```html
P5 props: <article><header><h2>Erciyes</h2></header><p>North ridge</p><footer>3917m</footer></article>
P5 children: <article><header><h2>Erciyes</h2></header><p>North ridge</p><footer>3917m</footer></article>
```

**When to choose each:** Use **named props** (`header`, `footer`, `summary`) when a component enforces a strict layout contract with distinct visual slots that must always render in fixed positions. Use **`children`** when the component is a generic wrapper or container (`Card`, `Modal`, `Layout`) whose caller controls the internal markup and ordering.

### P6: Defaults on props (`undefined` vs `null`)

```tsx
function DifficultyBadge({ level = 'Unrated' }: { level?: string | null }) {
  return <span className="badge">{level}</span>
}
```

**Output:**
```html
P6 omitted: <span class="badge">Unrated</span>
P6 undefined: <span class="badge">Unrated</span>
P6 null: <span class="badge"></span>
```

**Explanation:** Omitting `level` or passing `level={undefined}` triggers the Form 7 default `'Unrated'`. Passing `level={null}` bypasses the default (`null !== undefined`), and because React renders `null` as nothing, the `<span>` renders empty.

### P7: TypeScript prop types (`ReactNode`, `PropsWithChildren`, `ComponentProps<'button'>`)

- `children?: ReactNode`: Explicitly allows strings, numbers, JSX elements, arrays, `null`, `undefined`, and booleans, while rejecting plain objects or functions as children.
- `PropsWithChildren<{ heading: string }>`: Utility type that intersects `{ heading: string }` with `{ children?: ReactNode }`, saving boilerplate on wrapper components.
- `ComponentProps<'button'> & { variant?: 'primary' | 'ghost' }`: Inherits all native `<button>` attributes (`type`, `disabled`, `aria-label`, `onClick`) so `{...rest}` spreads cleanly onto `<button>` while rejecting invalid attributes like `href`.

**Output:**
```html
P7 ReactNode: <div><strong>Gear</strong>Rope</div>
P7 PropsWithChildren: <div><strong>Camp</strong>Tent</div>
P7 ComponentProps: <button data-variant="primary" type="submit" disabled="" aria-label="Save route">Save</button>
```

---

## JavaScript vs TypeScript

| Form / Topic | What stays the same in TS | What you must add in TS | Compiler error when wrong |
|---|---|---|---|
| **Form 1** (`const [x, y] = f()`) | Runtime destructuring syntax `[lowest, highest]` | Tuple return type `: [number, number]` on `f()` | `TS2488` or `number \| undefined` if inferred as `number[]` |
| **Form 2** (`[, second, ...rest]`) | Comma skipping and `...rest` syntax | Guard or `??` fallback under `noUncheckedIndexedAccess` | `TS18048: 'secondStage' is possibly 'undefined'` |
| **Form 3** (`[a, b] = [b, a]`) | Array swap assignment expression | Compatible variable types on both `let` bindings | `TS2322: Type 'number' is not assignable to type 'string'` |
| **Form 4** (`[a = 1, b = 2] = []`) | Default value `=` syntax inside brackets | Optional tuple `[string?]` or typed array `string[]` | `TS2322` if default value type disagrees with element type |
| **Form 5** (`{ peak, elevation } = t`) | Property extraction pattern | Object `type` or `interface` on source value | `TS2339: Property 'x' does not exist on type 'Route'` |
| **Form 6** (`{ peak: summitName }`) | Rename colon `source: alias` syntax | Type annotation **after** the whole pattern `: Route` | `TS2304: Cannot find name 'string'` if written `{ peak: string }` |
| **Form 7** (`{ permitRequired = false }`) | Default value syntax in object pattern | Optional property `permitRequired?: boolean` in type | `TS2322` if default type conflicts with declared property type |
| **Form 8** (`{ code, ...others }`) | Rest property collection syntax | Source object type so `others` gets inferred `Omit<...>` | `TS2700: Rest types may only be created from object types` |
| **Form 11** (`function f({ a = 1 }: Opts = {})`) | Parameter pattern and outer `= {}` default | Type annotation `: Opts` after the parameter pattern | `TS2554: Expected 1 arguments, but got 0` if `= {}` is omitted |
| **Props P1–P7** (`function Card({ children })`) | JSX syntax and parameter destructuring | `children?: ReactNode` or `PropsWithChildren` | `TS2339: Property 'children' does not exist on type '...'` |

---

## My own log

1. **Running `npm install` in the parent folder (`ENOENT`)**: I initially ran `npm install` inside `mis 233 assignment 4/` instead of `starter-2/`, hitting `npm error code ENOENT: Could not read package.json`. Moving into `starter-2/` resolved it.
2. **TypeScript errors before installing dependencies (`TS2307`)**: Opening `ts/props.tsx` in VS Code before `npm install` produced 64 errors (`Cannot find module 'react'` / `ts(2307)` and `JSX element implicitly has type 'any'`). Running `npm install` installed `@types/react` and cleared every error immediately.
3. **Passing a function as `children` in P3**: When testing `<Slot label="fn">{() => 'ignored'}</Slot>`, `renderToStaticMarkup` rendered an empty `<div></div>` and printed `Functions are not valid as a React child. This may happen if you return children instead of <children /> from render.` This showed me that React handles function children differently from `null`/`false` by actively warning during render.
4. **`noUncheckedIndexedAccess` turning `secondStage` into `string | undefined` (`TS18048`)**: In `ts/arrays.ts`, `const [, secondStage] = stages` on a `string[]` inferred `string | undefined` because `tsconfig.json` enables `noUncheckedIndexedAccess`. I learned that TypeScript models arbitrary-length arrays as potentially sparse, so either a default value or `??` narrowing is required.
5. **Passing `null` vs `undefined` to a defaulted prop in P6**: I expected `<DifficultyBadge level={null} />` to fall back to `'Unrated'`, just like `<DifficultyBadge level={undefined} />`. Instead, the output was `<span class="badge"></span>` because destructuring defaults check strictly for `undefined`.

---

## Bonus 1: LaTeX

The complete field guide has been typeset in LaTeX (`guide.tex`) and compiled to `guide.pdf` with a clickable table of contents, `listings` code blocks, and `booktabs` tables.

**Compilation commands used:**
```bash
pdflatex -interaction=nonstopmode guide.tex && pdflatex -interaction=nonstopmode guide.tex
```

---

## Bonus 2: Depth

All experiments below are implemented and verified in `ts/depth.ts` (`npx tsx ts/depth.ts`).

### 1. Destructuring any `Iterable` (`string`, `Set`, and infinite `Generator`)
Array destructuring does not require an `Array`—it invokes `[Symbol.iterator]()` on the right-hand value and calls `.next()` once per pattern slot. When the pattern finishes early, it calls `.return()` on the iterator, which allows safely taking the first three values from an infinite generator:

```ts
const [firstLetter, secondLetter, ...remainingLetters] = 'KACKAR'
const [camp1, camp2] = new Set(['Yukarı Kavrun', 'Dilberdüzü', 'Deniz Gölü', 'Dilberdüzü'])
const [alt1, alt2, alt3] = elevationGenerator(2000, 450)
```

**Real output:**
```text
B2.1 string: K A [ 'C', 'K', 'A', 'R' ]
B2.1 Set: Yukarı Kavrun | Dilberdüzü
B2.1 generator: 2000 2450 2900
```

### 2. Evaluation order, lazy defaults, and sequential bindings
Default value expressions are **lazy** (only evaluated when the slot is `undefined`), and patterns bind **left-to-right**, meaning a later default can reference an earlier destructured variable:

```ts
const [knownAlt = computeFallbackAltitude(), unknownAlt = computeFallbackAltitude()] = [2850]
const [baseCampAlt = 1800, highCampAlt = baseCampAlt + 1050] = []
```

**Real output:**
```text
B2.2 lazy default count: 1 values: 2850 1500
B2.2 sequential defaults: 1800 2850
```

### 3. Assignment targets and `for...in` vs `for...of`
Destructuring targets can be existing object properties (`;[summitCoords.lat, summitCoords.lon] = [40.835, 41.161]`). Conversely, using `for...in` on an array yields string indices (`'0'`, `'1'`), so `[ch0, ch1] = key` destructures the characters of the index string:

```text
B2.3 property target: { lat: 40.835, lon: 41.161 }
B2.3 for...in string destructure: [ '0:undefined', '1:undefined' ]
```

### 4. Type-level destructuring with `infer` and `Parameters<F>`
TypeScript conditional types mirror runtime array destructuring at compile time using variadic tuple inference:

```ts
type Head<T extends readonly unknown[]> = T extends readonly [infer First, ...unknown[]] ? First : never
type Tail<T extends readonly unknown[]> = T extends readonly [unknown, ...infer Rest] ? Rest : never
```

**Real output:** `B2.4 type-level infer: Kaçkar [ 3932, true ]`

### 5. Readability & refactoring: when destructuring hurts
Deeply nested patterns with simultaneous renames (`const { meta: { author: { fullName: writer } }, stats: { views: totalViews = 0 } } = article`) force readers to track two identifiers per field. Splitting into two flat destructuring steps (`const { meta, stats } = article; const { fullName: writer } = meta`) keeps each line self-explanatory.

---

## Bonus 3: Real code

Below are five real destructuring cases extracted from the Assignment 3 Task Manager starter (`starter/src/`), mapped to the twelve forms in this guide.

1. **Assignment 3 Task Manager — `useReducer` tuple (`starter/src/App.tsx`, line 90):**
   - **Code:** `const [state, dispatch] = useReducer(taskReducer, initialState)`
   - **Form:** **Form 1** (array destructuring by position from a fixed 2-tuple returned by `useReducer`).
   - **Without destructuring:**
     ```ts
     const reducerResult = useReducer(taskReducer, initialState)
     const state = reducerResult[0]
     const dispatch = reducerResult[1]
     ```

2. **Assignment 3 Task Manager — `AddForm` parameter (`starter/src/App.tsx`, line 13):**
   - **Code:** `function AddForm({ dispatch }: { dispatch: Dispatch<Action> })`
   - **Form:** **Form 11 + Form 5** (object destructuring in a function parameter list).
   - **Without destructuring:**
     ```ts
     function AddForm(props: { dispatch: Dispatch<Action> }) {
       const dispatch = props.dispatch
       // ...
     }
     ```

3. **Assignment 3 Task Manager — `TaskList` parameter (`starter/src/App.tsx`, line 70):**
   - **Code:** `function TaskList({ tasks, dispatch }: { tasks: Task[]; dispatch: Dispatch<Action> })`
   - **Form:** **Form 11 + Form 5** (extracting multiple properties by name from the component's `props` object).
   - **Without destructuring:**
     ```ts
     function TaskList(props: { tasks: Task[]; dispatch: Dispatch<Action> }) {
       const tasks = props.tasks
       const dispatch = props.dispatch
       // ...
     }
     ```

4. **Assignment 3 Task Manager — `TaskRow` React props (`starter/src/TaskRow.tsx`, line 5):**
   - **Code:** `export default function TaskRow({ task, onNext, onDelete }: TaskRowProps)`
   - **Form:** **Form 11 + Form 5** (object property destructuring on component `props`).
   - **Without destructuring:**
     ```ts
     export default function TaskRow(props: TaskRowProps) {
       const task = props.task
       const onNext = props.onNext
       const onDelete = props.onDelete
       // ...
     }
     ```
   - **Props vs. `children`:** Here `task`, `onNext`, and `onDelete` are explicit **props** passed as JSX attributes (`<TaskRow task={t} onNext={...} onDelete={...} />`). `children` is not used (`props.children` is `undefined`) because `TaskRow` renders a rigid `<tr>` table-row layout with fixed `<td>` cells rather than wrapping arbitrary caller-supplied JSX content.

5. **Where destructuring makes code worse — `FilterBar` multi-line signature (`starter/src/App.tsx`, line 26):**
   - **Code:** `function FilterBar({ ... })` (multi-line parameter destructuring across multiple filter state values and callbacks).
   - **Form:** **Form 11 + Form 5**.
   - **Without destructuring:** `function FilterBar(props: FilterBarProps)` and accessing `props.filter` / `props.onChange` inside the body.
   - **Why it makes the code worse:** When a component accepts many control props in a multi-line destructured signature, every property name has to be repeated in the parameter pattern and again in the `Props` type definition, pushing the function body far down the file and hiding whether a variable inside the JSX is a local state variable or an external prop passed from `App`.

---

## Bonus 4: Git repository

Repository URL: `[https://github.com/mfurkanyilmaz/mis233-assignment4-destructuring](https://github.com/mfurkanyilmaz/mis233-assignment4-destructuring)`

- Includes `.gitignore` excluding `node_modules/` and `.DS_Store`.
- Verified clean clone workflow: `git clone <url> && cd mis233-assignment4-destructuring && npm install && npm run all && npm run check`.
- Commit history developed incrementally across steps:
  1. `init: import Assignment 4 starter project and configure TypeScript`
  2. `feat(js): implement array, object, and parameter destructuring forms 1-12`
  3. `feat(js): add five destructuring pitfalls and runtime demonstrations`
  4. `feat(ts): add typed forms 1-12 and TypeScript topics T1-T5`
  5. `feat(react): implement props and children experiments P1-P7 in JS and TS`
  6. `docs: add complete field guide, output.txt, LaTeX PDF, and bonus analyses`
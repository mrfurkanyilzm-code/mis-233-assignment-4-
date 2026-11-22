// Muhammet Furkan Yılmaz, 2024502108
// Props and children in plain JavaScript (JSX). Run with `npx tsx js/props.jsx`.
import { renderToStaticMarkup } from 'react-dom/server'

// P1: props is ONE object; the parameter pattern takes it apart (Form 11 + Form 5).
function CardA(props) {
  return <section><h2>{props.title}</h2>{props.children}</section>
}
function CardB({ title, children }) {
  return <section><h2>{title}</h2>{children}</section>
}
console.log('P1 A:', renderToStaticMarkup(<CardA title="Hi">text</CardA>))
console.log('P1 B:', renderToStaticMarkup(<CardB title="Hi">text</CardB>))

// P2: children is only a prop — tag body and explicit children prop produce identical output.
console.log('P2 tag body:', renderToStaticMarkup(<CardB title="Kaçkar">Ridge route</CardB>))
console.log('P2 prop attr:', renderToStaticMarkup(<CardB title="Kaçkar" children="Ridge route" />))

// P3: what children can be (string, number, one element, several elements, undefined, null, false, function).
function Slot({ label, children }) {
  return <div data-case={label}>{children}</div>
}
console.log('P3 string:', renderToStaticMarkup(<Slot label="string">Base camp</Slot>))
console.log('P3 number:', renderToStaticMarkup(<Slot label="number">{3932}</Slot>))
console.log('P3 one-el:', renderToStaticMarkup(<Slot label="one-el"><span>Alpine</span></Slot>))
console.log(
  'P3 multi-el:',
  renderToStaticMarkup(
    <Slot label="multi-el">
      <span>Day 1</span>
      <span>Day 2</span>
    </Slot>
  )
)
console.log('P3 undefined:', renderToStaticMarkup(<Slot label="undef">{undefined}</Slot>))
console.log('P3 null:', renderToStaticMarkup(<Slot label="null">{null}</Slot>))
console.log('P3 false:', renderToStaticMarkup(<Slot label="false">{false}</Slot>))
console.log('P3 function:', renderToStaticMarkup(<Slot label="fn">{() => 'ignored'}</Slot>))

// P4: separating children from rest props, and how spread order decides which prop wins.
function RoutePanelRestFirst({ title, children, ...rest }) {
  return (
    <section className="panel-default" {...rest}>
      <h3>{title}</h3>
      {children}
    </section>
  )
}
function RoutePanelRestLast({ title, children, ...rest }) {
  return (
    <section {...rest} className="panel-forced">
      <h3>{title}</h3>
      {children}
    </section>
  )
}
console.log(
  'P4 rest-wins:',
  renderToStaticMarkup(
    <RoutePanelRestFirst title="Aladağlar" id="route-1" className="panel-custom">
      <p>2 days</p>
    </RoutePanelRestFirst>
  )
)
console.log(
  'P4 explicit-wins:',
  renderToStaticMarkup(
    <RoutePanelRestLast title="Aladağlar" id="route-1" className="panel-custom">
      <p>2 days</p>
    </RoutePanelRestLast>
  )
)

// P5: props vs children — structured slots as props vs free-form children.
function ExpeditionWithProps({ header, footer, summary }) {
  return (
    <article>
      <header>{header}</header>
      <p>{summary}</p>
      <footer>{footer}</footer>
    </article>
  )
}
function ExpeditionWithChildren({ children }) {
  return <article>{children}</article>
}
console.log(
  'P5 props:',
  renderToStaticMarkup(
    <ExpeditionWithProps header={<h2>Erciyes</h2>} summary="North ridge" footer="3917m" />
  )
)
console.log(
  'P5 children:',
  renderToStaticMarkup(
    <ExpeditionWithChildren>
      <header><h2>Erciyes</h2></header>
      <p>North ridge</p>
      <footer>3917m</footer>
    </ExpeditionWithChildren>
  )
)

// P6: defaults on props (Form 7) — undefined triggers the default, null does not.
function DifficultyBadge({ level = 'Unrated' }) {
  return <span className="badge">{level}</span>
}
console.log('P6 omitted:', renderToStaticMarkup(<DifficultyBadge />))
console.log('P6 undefined:', renderToStaticMarkup(<DifficultyBadge level={undefined} />))
console.log('P6 null:', renderToStaticMarkup(<DifficultyBadge level={null} />))
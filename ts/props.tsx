// Muhammet Furkan Yılmaz, 2024502108
// Props and children in TypeScript. Run with `npx tsx ts/props.tsx`.
import type { ComponentProps, PropsWithChildren, ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

type CardProps = { title: string; children?: ReactNode }

// P1: props is ONE object; CardA and CardB are equivalent (Form 11 + Form 5).
function CardA(props: CardProps) {
  return <section><h2>{props.title}</h2>{props.children}</section>
}
function CardB({ title, children }: CardProps) {
  return <section><h2>{title}</h2>{children}</section>
}
console.log('P1 A:', renderToStaticMarkup(<CardA title="Hi">text</CardA>))
console.log('P1 B:', renderToStaticMarkup(<CardB title="Hi">text</CardB>))

// P2: children is only a prop.
console.log('P2 tag body:', renderToStaticMarkup(<CardB title="Kaçkar">Ridge route</CardB>))
console.log('P2 prop attr:', renderToStaticMarkup(<CardB title="Kaçkar" children="Ridge route" />))

// P3: what children can be.
function Slot({ label, children }: { label: string; children?: ReactNode }) {
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

// P4: separating children from other props with rest + spread order.
type RoutePanelProps = {
  title: string
  children?: ReactNode
} & ComponentProps<'section'>

function RoutePanelRestFirst({ title, children, ...rest }: RoutePanelProps) {
  return (
    <section className="panel-default" {...rest}>
      <h3>{title}</h3>
      {children}
    </section>
  )
}
function RoutePanelRestLast({ title, children, ...rest }: RoutePanelProps) {
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

// P5: props or children?
function ExpeditionWithProps({
  header,
  footer,
  summary
}: {
  header: ReactNode
  footer: ReactNode
  summary: string
}) {
  return (
    <article>
      <header>{header}</header>
      <p>{summary}</p>
      <footer>{footer}</footer>
    </article>
  )
}
function ExpeditionWithChildren({ children }: PropsWithChildren) {
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

// P6: defaults on props (Form 7) — undefined triggers default, null does not.
function DifficultyBadge({ level = 'Unrated' }: { level?: string | null }) {
  return <span className="badge">{level}</span>
}
console.log('P6 omitted:', renderToStaticMarkup(<DifficultyBadge />))
console.log('P6 undefined:', renderToStaticMarkup(<DifficultyBadge level={undefined} />))
console.log('P6 null:', renderToStaticMarkup(<DifficultyBadge level={null} />))

// P7: children?: ReactNode vs PropsWithChildren vs ComponentProps<'button'>
type StrictBoxProps = { heading: string; children?: ReactNode }
type WrappedBoxProps = PropsWithChildren<{ heading: string }>
type ActionButtonProps = ComponentProps<'button'> & { variant?: 'primary' | 'ghost' }

function StrictBox({ heading, children }: StrictBoxProps) {
  return <div><strong>{heading}</strong>{children}</div>
}
function WrappedBox({ heading, children }: WrappedBoxProps) {
  return <div><strong>{heading}</strong>{children}</div>
}
function ActionButton({ variant = 'primary', children, ...rest }: ActionButtonProps) {
  return <button data-variant={variant} {...rest}>{children}</button>
}

console.log('P7 ReactNode:', renderToStaticMarkup(<StrictBox heading="Gear">Rope</StrictBox>))
console.log('P7 PropsWithChildren:', renderToStaticMarkup(<WrappedBox heading="Camp">Tent</WrappedBox>))
console.log(
  'P7 ComponentProps:',
  renderToStaticMarkup(
    <ActionButton type="submit" disabled aria-label="Save route">
      Save
    </ActionButton>
  )
)
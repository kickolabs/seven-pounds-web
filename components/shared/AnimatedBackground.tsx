// Pure CSS animation — no JS, no hydration cost
export default function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] mix-blend-multiply">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
    </div>
  )
}

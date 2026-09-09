import { useHoldToReveal } from '../hooks/useHoldToReveal'

/**
 * A privacy-safe secret card. Hidden by default; shows `children` only
 * while actively pressed/held (mouse, touch, pen, or Space/Enter), and
 * hides again the instant it's released. Nothing in `children` should be
 * rendered to the DOM except through this component, so a secret never
 * lingers on screen or in the accessibility tree after release.
 */
export function HoldToReveal({ children, accentClass = 'border-line-strong', onFirstReveal }) {
  const { isHeld, bind } = useHoldToReveal()

  function handlePointerDown(event) {
    bind.onPointerDown(event)
    onFirstReveal?.()
  }

  function handleKeyDown(event) {
    bind.onKeyDown(event)
    if (event.key === ' ' || event.key === 'Enter') onFirstReveal?.()
  }

  return (
    <div
      {...bind}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      aria-label={isHeld ? 'Your secret, revealed. Release to hide.' : 'Press and hold to reveal your secret'}
      className={`relative flex aspect-[4/5] w-full cursor-pointer select-none flex-col items-center justify-center overflow-hidden rounded-2xl border-2 bg-ink-elevated text-center shadow-card transition-colors duration-150 ${
        isHeld ? accentClass : 'border-line-strong'
      }`}
    >
      {isHeld ? (
        <div className="flex flex-col items-center gap-1 px-6">{children}</div>
      ) : (
        <div className="flex flex-col items-center gap-4 px-6 text-paper-dim">
          <LockIcon />
          <p className="font-display text-lg font-semibold tracking-wide text-paper">
            Press &amp; hold
            <br />
            to reveal
          </p>
        </div>
      )}
    </div>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10 text-paper-faint" aria-hidden="true">
      <rect x="10" y="21" width="28" height="20" rx="4" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M16 21v-6a8 8 0 0 1 16 0v6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="24" cy="30" r="2.4" fill="currentColor" />
    </svg>
  )
}

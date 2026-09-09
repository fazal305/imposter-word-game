// Temporary stand-in for phases not yet implemented (built out in later
// phases of the project). Keeps the state flow navigable end-to-end without
// pretending any functionality exists that isn't really there.
export function PlaceholderPhase({ title, description, onBack }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-sm uppercase tracking-[0.3em] text-accent">Coming soon</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-paper">{title}</h1>
      <p className="mt-3 text-sm text-paper-dim">{description}</p>
      <button
        type="button"
        onClick={onBack}
        className="mt-8 rounded-xl border border-line px-5 py-2.5 text-sm font-medium text-paper-dim hover:border-line-strong"
      >
        Back to setup
      </button>
    </div>
  )
}

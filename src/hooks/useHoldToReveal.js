import { useCallback, useRef, useState } from 'react'

const ACTIVATE_KEYS = new Set([' ', 'Enter', 'Spacebar'])

/**
 * Press-and-hold interaction built on Pointer Events so mouse, touch, and
 * pen all go through one code path, with a keyboard fallback (hold Space or
 * Enter) so the reveal is never mouse/touch-only.
 *
 * Returns `isHeld` plus a `bind` object of event handlers to spread onto the
 * interactive element. The element should also set `touch-action: none` in
 * CSS so a hold doesn't trigger a scroll gesture on mobile.
 */
export function useHoldToReveal() {
  const [isHeld, setIsHeld] = useState(false)
  const pointerIdRef = useRef(null)

  const release = useCallback(() => setIsHeld(false), [])

  const handlePointerDown = useCallback((event) => {
    event.preventDefault()
    pointerIdRef.current = event.pointerId
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId)
    } catch {
      // Some browsers/devices reject capture for a pointer id that's
      // already gone (e.g. a very short tap) — the hold still works
      // via the pointerup/leave handlers below, so this is safe to ignore.
    }
    setIsHeld(true)
  }, [])

  const handlePointerUp = useCallback(
    (event) => {
      if (pointerIdRef.current !== null) {
        try {
          event.currentTarget.releasePointerCapture?.(pointerIdRef.current)
        } catch {
          // Capture may never have been acquired, or was already released.
        }
      }
      pointerIdRef.current = null
      release()
    },
    [release]
  )

  const handleKeyDown = useCallback((event) => {
    if (!ACTIVATE_KEYS.has(event.key) || event.repeat) return
    event.preventDefault()
    setIsHeld(true)
  }, [])

  const handleKeyUp = useCallback(
    (event) => {
      if (!ACTIVATE_KEYS.has(event.key)) return
      event.preventDefault()
      release()
    },
    [release]
  )

  const bind = {
    role: 'button',
    tabIndex: 0,
    'aria-pressed': isHeld,
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerUp,
    onPointerLeave: handlePointerUp,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    onBlur: release,
    onContextMenu: (event) => event.preventDefault(),
    style: { touchAction: 'none' },
  }

  return { isHeld, bind }
}

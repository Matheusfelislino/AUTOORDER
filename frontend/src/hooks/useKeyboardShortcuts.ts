import { useEffect } from 'react'

interface ShortcutOptions {
  onArrowUp: () => void
  onArrowDown: () => void
  onCmdEnter: () => void
  onBracketLeft?: () => void
}

export function useKeyboardShortcuts({ onArrowUp, onArrowDown, onCmdEnter, onBracketLeft }: ShortcutOptions) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        onArrowUp()
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        onArrowDown()
      }

      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onCmdEnter()
      }

      if (e.key === '[') {
        onBracketLeft?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onArrowUp, onArrowDown, onCmdEnter, onBracketLeft])
}

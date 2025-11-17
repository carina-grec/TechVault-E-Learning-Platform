import { useState, useEffect, useCallback } from 'react'

const normalizePath = () => {
  if (typeof window === 'undefined') {
    return '/'
  }
  const hash = window.location.hash ?? ''
  const clean = hash.replace(/^#/, '')
  return clean || '/'
}

export function useHashLocation() {
  const [path, setPath] = useState(normalizePath)

  useEffect(() => {
    const handleChange = () => setPath(normalizePath())
    window.addEventListener('hashchange', handleChange)
    return () => window.removeEventListener('hashchange', handleChange)
  }, [])

  const navigate = useCallback((nextPath) => {
    if (typeof window === 'undefined') return
    const target = nextPath.startsWith('#') ? nextPath : `#${nextPath}`
    if (window.location.hash === target) {
      setPath(normalizePath())
      return
    }
    window.location.hash = target
  }, [])

  return [path, navigate]
}

'use client'

import { useEffect, useState } from "react"

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)
  const [loaded, setLoaded] = useState(false)

  // load
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key)
      if (saved !== null) {
        setValue(JSON.parse(saved))
      }
    } catch (e) {
      console.error("Failed to load localStorage:", key, e)
    } finally {
      setLoaded(true)
    }
  }, [key])

  // save
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error("Failed to save localStorage:", key, e)
    }
  }, [key, value, loaded])

  return [value, setValue, loaded] as const
}

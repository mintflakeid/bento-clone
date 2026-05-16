import { useState, useEffect } from 'react'

type SocialData = {
  profile?: any
  user?: any
  channel?: any
  data?: any
  posts?: any[]
  repos?: any[]
  videos?: any[]
  shots?: any[]
  tweets?: any[]
  followers?: string
  subscribers?: string
  shots_count?: number
}

export function useSocialData(
  variant: string,
  handle: string,
  enabled = true
) {
  const [data, setData] = useState<SocialData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled || !handle) {
      setData(null)
      return
    }

    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        let response

        switch (variant) {
          case 'github':
            response = await fetch(`/api/social/github?username=${encodeURIComponent(handle)}`)
            break
          case 'twitter':
            response = await fetch(`/api/social/twitter?username=${encodeURIComponent(handle)}`)
            break
          case 'instagram':
            response = await fetch(`/api/social/instagram?username=${encodeURIComponent(handle)}`)
            break
          case 'youtube':
            response = await fetch(`/api/social/youtube?username=${encodeURIComponent(handle)}`)
            break
          case 'dribbble':
            response = await fetch(`/api/social/dribbble?username=${encodeURIComponent(handle)}`)
            break
          default:
            setLoading(false)
            return
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch ${variant} data`)
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
        console.error(`Error fetching ${variant} data:`, err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [variant, handle, enabled])

  return { data, loading, error }
}

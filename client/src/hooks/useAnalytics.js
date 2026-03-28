import { useState, useEffect } from 'react'
import { analyticsAPI } from '../api/services'

export function useAnalytics(decisionId = null) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    const req = decisionId
      ? analyticsAPI.timeline(decisionId)
      : analyticsAPI.summary()

    req
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [decisionId])

  return { data, loading, error }
}

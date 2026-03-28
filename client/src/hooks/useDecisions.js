import { useState, useEffect, useCallback } from 'react'
import { decisionsAPI } from '../api/services'

export function useDecisions() {
  const [decisions, setDecisions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await decisionsAPI.getAll()
      setDecisions(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load decisions')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const remove = async (id) => {
    await decisionsAPI.delete(id)
    setDecisions((prev) => prev.filter((d) => d.id !== id))
  }

  return { decisions, loading, error, refetch: fetch, remove }
}

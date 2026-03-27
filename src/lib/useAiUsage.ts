import { useCallback, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'

export const AI_DAILY_LIMIT = 10

export function useAiUsage(user: User | null) {
  const [usedToday, setUsedToday] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchUsage = useCallback(async () => {
    if (!user) { setUsedToday(0); return }
    setLoading(true)
    const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    const { count } = await supabase
      .from('ai_usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', `${today}T00:00:00.000Z`)
    setUsedToday(count ?? 0)
    setLoading(false)
  }, [user])

  useEffect(() => { fetchUsage() }, [fetchUsage])

  async function recordUsage(): Promise<boolean> {
    if (!user) return false
    if (usedToday >= AI_DAILY_LIMIT) return false
    const { error } = await supabase
      .from('ai_usage')
      .insert({ user_id: user.id })
    if (!error) setUsedToday((n) => n + 1)
    return !error
  }

  const remaining = Math.max(0, AI_DAILY_LIMIT - usedToday)
  const atLimit = usedToday >= AI_DAILY_LIMIT

  return { usedToday, remaining, atLimit, loading, recordUsage, refetch: fetchUsage }
}

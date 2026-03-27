import { useCallback, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import type { SavedConfig } from './supabase'
import type { CustomBlock } from './generator'

export function useConfigs(user: User | null) {
  const [configs, setConfigs] = useState<SavedConfig[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConfigs = useCallback(async () => {
    if (!user) { setConfigs([]); return }
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('configs')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setConfigs(data ?? [])
    }
  }, [user])

  useEffect(() => { fetchConfigs() }, [fetchConfigs])

  async function saveConfig(
    name: string,
    selectedModuleIds: string[],
    customBlocks: CustomBlock[]
  ): Promise<boolean> {
    if (!user) return false
    setSaving(true)
    setError(null)
    const { error } = await supabase.from('configs').insert({
      user_id: user.id,
      name,
      selected_module_ids: selectedModuleIds,
      custom_blocks: customBlocks,
    })
    setSaving(false)
    if (error) {
      setError(error.message)
      return false
    }
    fetchConfigs()
    return true
  }

  async function deleteConfig(id: string) {
    setError(null)
    const { error } = await supabase.from('configs').delete().eq('id', id)
    if (error) {
      setError(error.message)
    } else {
      setConfigs((prev) => prev.filter((c) => c.id !== id))
    }
  }

  return { configs, saving, loading, error, saveConfig, deleteConfig, refetch: fetchConfigs }
}

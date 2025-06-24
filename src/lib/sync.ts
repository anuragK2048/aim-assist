import { supabase } from './supabase'
import { useAppStore } from '@store/useAppStore'
import { Goal, Target, Node, Task } from '@types'

const tables = ['goals', 'targets', 'nodes', 'tasks'] as const

export function initRealtime(userId: string) {
  for (const table of tables) {
    supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const store = useAppStore.getState()

          const { eventType, new: newRow, old } = payload

          switch (table) {
            case 'goals':
              applyChange(store, 'goals', eventType, newRow, old)
              break
            case 'targets':
              applyChange(store, 'targets', eventType, newRow, old)
              break
            case 'nodes':
              applyChange(store, 'nodes', eventType, newRow, old)
              break
            case 'tasks':
              applyChange(store, 'tasks', eventType, newRow, old)
              break
          }
        }
      )
      .subscribe()
  }
}

function applyChange<T extends Goal | Target | Node | Task>(
  store: ReturnType<typeof useAppStore.getState>,
  key: 'goals' | 'targets' | 'nodes' | 'tasks',
  type: string,
  newRow?: T,
  oldRow?: T
) {
  if (type === 'INSERT' && newRow) {
    store[key] = [...store[key], newRow]
  } else if (type === 'UPDATE' && newRow) {
    store[key] = store[key].map((item) => (item.id === newRow.id ? newRow : item))
  } else if (type === 'DELETE' && oldRow) {
    store[key] = store[key].filter((item) => item.id !== oldRow.id)
  }
}

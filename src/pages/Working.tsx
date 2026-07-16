import { useEffect } from 'react'
import { useAppStore } from '../stores/appStore'

export default function Working() {
  const setPageTitle = useAppStore((s) => s.setPageTitle)

  useEffect(() => {
    setPageTitle('Working')
  }, [setPageTitle])

  return (
    <div className="page">
      <h1>Working</h1>
      <p>View and manage your active tasks.</p>
    </div>
  )
}

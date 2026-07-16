import { useEffect } from 'react'
import { useAppStore } from '../stores/appStore'

export default function Models() {
  const setPageTitle = useAppStore((s) => s.setPageTitle)

  useEffect(() => {
    setPageTitle('Models')
  }, [setPageTitle])

  return (
    <div className="page">
      <h1>Models</h1>
      <p>Browse and configure available AI models.</p>
    </div>
  )
}

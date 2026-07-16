import { useEffect } from 'react'
import { useAppStore } from '../stores/appStore'

export default function Home() {
  const setPageTitle = useAppStore((s) => s.setPageTitle)

  useEffect(() => {
    setPageTitle('Home')
  }, [setPageTitle])

  return (
    <div className="page">
      <h1>Browser AI</h1>
      <p>Welcome to Browser AI — your intelligent browsing companion.</p>
    </div>
  )
}

import { useEffect } from 'react'
import { Outlet } from '@tanstack/react-router'
import { Analytics } from '@vercel/analytics/react'
import { useAppStore } from './stores/appStore'

function App() {
  const pageTitle = useAppStore((s) => s.pageTitle)

  useEffect(() => {
    document.title = `ZeroLocal — ${pageTitle}`
  }, [pageTitle])

  return (
    <>
      <Analytics />
      <Outlet />
    </>
  )
}

export default App

import { useEffect } from 'react'
import { useAppStore } from '../stores/appStore'

export default function Chat() {
  const setPageTitle = useAppStore((s) => s.setPageTitle)

  useEffect(() => {
    setPageTitle('Chat')
  }, [setPageTitle])

  return (
    <div className="page">
      <h1>Chat</h1>
      <p>Start a conversation with your AI assistant.</p>
    </div>
  )
}

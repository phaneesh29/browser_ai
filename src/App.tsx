import { Link, Outlet } from '@tanstack/react-router'
import { useAppStore } from './stores/appStore'
import './App.css'

function App() {
  const pageTitle = useAppStore((s) => s.pageTitle)

  return (
    <>
      <header className="app-header">
        <nav className="app-nav">
          <span className="app-logo">🧠 Browser AI</span>
          <div className="nav-links">
            <Link to="/" className="nav-link" activeProps={{ className: 'nav-link active' }}>
              Home
            </Link>
            <Link to="/working" className="nav-link" activeProps={{ className: 'nav-link active' }}>
              Working
            </Link>
            <Link to="/models" className="nav-link" activeProps={{ className: 'nav-link active' }}>
              Models
            </Link>
            <Link to="/chat" className="nav-link" activeProps={{ className: 'nav-link active' }}>
              Chat
            </Link>
          </div>
        </nav>
        <div className="page-title-bar">
          <h2 className="page-title">{pageTitle}</h2>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </>
  )
}

export default App

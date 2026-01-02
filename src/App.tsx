function App() {
  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 'var(--spacing-lg)' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        ALMODOVARBOX
      </h1>
      <p style={{ fontSize: '1.25rem', color: '#94a3b8' }}>
        Fitness App
      </p>
      <button style={{ 
        backgroundColor: 'var(--color-primary)', 
        color: 'white', 
        padding: '0.75rem 1.5rem', 
        borderRadius: 'var(--radius-md)', 
        fontWeight: 600,
        transition: 'all 0.2s ease'
      }}>
        Get Started
      </button>
    </div>
  )
}

export default App

import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Erreur capturée par ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 16, padding: '2rem',
          background: '#0A0B10', color: '#F1F5F9', textAlign: 'center',
        }}>
          <div style={{ fontSize: '1.1rem', fontFamily: "'Archivo Black', sans-serif" }}>Une erreur s'est produite</div>
          <p style={{ color: '#9CA3AF', fontSize: '.85rem', fontFamily: "'Azeret Mono', monospace", maxWidth: 420 }}>
            Quelque chose a empêché l'affichage de cette page. Clique pour réessayer — si le problème persiste, recharge la page.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{ padding: '10px 22px', background: '#4ADE80', color: '#0A0B10', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: "'Archivo Black', sans-serif", fontSize: '.8rem' }}
          >Réessayer</button>
        </div>
      )
    }
    return this.props.children
  }
}

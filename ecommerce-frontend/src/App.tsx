import { Outlet, Link } from 'react-router-dom'

export default function App() {
  return (
    <div style={{ 
      backgroundColor: '#FFFFFF', 
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{  
        width: '100%',
        padding: '20px'
      }}>
        <header style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 12, 
          marginBottom: 24,
          paddingTop: 16
        }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ 
              alignContent: 'center',
              color: '#FF5F00',
              fontSize: '2.5rem',
              fontWeight: 'bold',
            }}>
              E-commerce App
            </h1>
          </Link>
        </header>
        <Outlet />
      </div>
    </div>
  )
}
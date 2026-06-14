function Login() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#1C1C1E',
    }}>
      <h1 style={{ color: '#F1EFE8', fontSize: '2rem', marginBottom: '2rem' }}>
        Lock <span style={{ color: '#639922' }}>In!</span>
      </h1>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '300px',
      }}>
        <input
          type="text"
          placeholder="Email / Usuario"
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #2C2C2E',
            backgroundColor: '#2C2C2E',
            color: '#F1EFE8',
            fontSize: '0.95rem',
            outline: 'none',
          }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #2C2C2E',
            backgroundColor: '#2C2C2E',
            color: '#F1EFE8',
            fontSize: '0.95rem',
            outline: 'none',
          }}
        />
        <button style={{
          padding: '0.75rem',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: '#639922',
          color: '#F1EFE8',
          fontSize: '0.95rem',
          fontWeight: '600',
          cursor: 'pointer',
        }}>
          Iniciar sesión
        </button>

        <p style={{ color: '#888', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>
          ¿Has olvidado tu contraseña?
        </p>
        <p style={{ color: '#888', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>
          ¿Primera vez que usas Lock In?{' '}
          <span style={{ color: '#639922', cursor: 'pointer' }}>Crear una cuenta</span>
        </p>
      </div>
    </div>
  )
}

export default Login
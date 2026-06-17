import { useTheme } from '../theme.jsx'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Register() {
  const { colors } = useTheme()
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState('')

  const handleRegister = async () => {
    setError('')
    if (password !== confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }
    try {
      const response = await fetch('http://localhost:8080/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre,
          usuario: nombre,
          email: email,
          passwordHash: password
        })
      })

      if (!response.ok) {
        setError('Error al crear la cuenta')
        return
      }

      navigate('/')

    } catch (e) {
      setError('No se pudo conectar con el servidor')
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: colors.bgDark,
      position: 'relative',
    }}>

      <div
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          color: colors.textMuted,
          cursor: 'pointer',
          fontSize: '1.5rem',
          lineHeight: 1,
        }}
      >
        ←
      </div>

      <h1 style={{ color: colors.textPrimary, fontSize: '2rem', marginBottom: '2rem' }}>
        Lock <span style={{ color: colors.accentMain }}>In!</span>
      </h1>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '300px',
      }}>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: `1px solid ${colors.bgSurface}`,
            backgroundColor: colors.bgSurface,
            color: colors.textPrimary,
            fontSize: '0.95rem',
            outline: 'none',
          }}
        />
        <input
          type="email"
          placeholder="Introduce tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: `1px solid ${colors.bgSurface}`,
            backgroundColor: colors.bgSurface,
            color: colors.textPrimary,
            fontSize: '0.95rem',
            outline: 'none',
          }}
        />
        <input
          type="password"
          placeholder="Introduce una contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: `1px solid ${colors.bgSurface}`,
            backgroundColor: colors.bgSurface,
            color: colors.textPrimary,
            fontSize: '0.95rem',
            outline: 'none',
          }}
        />
        <p style={{ color: colors.textMuted, fontSize: '0.78rem', margin: '-0.5rem 0 0 0.25rem' }}>
          Mínimo 8 caracteres, 1 dígito y un carácter especial
        </p>
        <input
          type="password"
          placeholder="Confirma la contraseña"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: `1px solid ${colors.bgSurface}`,
            backgroundColor: colors.bgSurface,
            color: colors.textPrimary,
            fontSize: '0.95rem',
            outline: 'none',
          }}
        />

        {error && (
          <p style={{ color: '#E07070', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>
            {error}
          </p>
        )}

        <button
          onClick={handleRegister}
          style={{
            padding: '0.75rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: colors.accentMain,
            color: colors.textPrimary,
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '0.5rem',
          }}>
          Crear cuenta
        </button>

        <p style={{ color: colors.textMuted, fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>
          ¿Ya tienes cuenta?{' '}
          <span
            style={{ color: colors.accentMain, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Iniciar sesión
          </span>
        </p>
      </div>
    </div>
  )
}

export default Register
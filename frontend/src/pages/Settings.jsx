import { useNavigate } from 'react-router-dom'
import { useTheme } from '../theme.jsx'

function Settings() {
  const navigate = useNavigate()
  const { theme, toggleTheme, colors } = useTheme()

  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px 24px',
      backgroundColor: colors.bgDark,
      color: colors.textPrimary,
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          style={{
            marginBottom: '24px',
            background: 'transparent',
            border: `1px solid ${colors.textMuted}`,
            color: colors.textPrimary,
            borderRadius: '12px',
            padding: '10px 14px',
            cursor: 'pointer',
          }}>
          ← Volver al panel
        </button>

        <h1 style={{ margin: 0, fontSize: '2rem', letterSpacing: '-0.03em' }}>Ajustes</h1>
        <p style={{ color: colors.textMuted, marginTop: '10px', maxWidth: '620px' }}>
          Configura tu experiencia de Lock In! Aquí puedes cambiar entre tema claro y oscuro.
        </p>

        <section style={{
          marginTop: '32px',
          padding: '28px',
          borderRadius: '24px',
          background: colors.bgSurface,
          boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem' }}>Tema</h2>
              <p style={{ margin: '8px 0 0', color: colors.textMuted, fontSize: '0.95rem' }}>
                Cambia la apariencia de la aplicación entre modo claro y modo oscuro.
              </p>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              style={{
                minWidth: '150px',
                padding: '12px 18px',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                background: theme === 'light' ? '#172018' : colors.accentMain,
                color: theme === 'light' ? '#F5F3EE' : '#172018',
                fontWeight: 700,
              }}>
              {theme === 'light' ? 'Modo claro' : 'Modo oscuro'}
            </button>
          </div>
        </section>

        <div style={{ marginTop: '24px', color: colors.textMuted, fontSize: '0.9rem' }}>
          Tema actual: <strong style={{ color: colors.textPrimary }}>{theme}</strong>
        </div>
      </div>
    </div>
  )
}

export default Settings


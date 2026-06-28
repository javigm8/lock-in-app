import { useState, useRef } from "react";
import { useTheme } from "../theme.jsx";
import { Pencil, User } from "lucide-react";
import "../styles/ProfileModal.css";

function ProfileModal({ usuario, onClose, onSave }) {
  const { colors } = useTheme();
  const token = localStorage.getItem("token");

  const config = usuario?.configuracion
    ? JSON.parse(usuario.configuracion)
    : {};

  // Campos editables del perfil
  const [nombre, setNombre] = useState(usuario?.nombre ?? "");
  const [email, setEmail] = useState(usuario?.email ?? "");
  const [password, setPassword] = useState("");
  const [editarPassword, setEditarPassword] = useState(false);
  const [avatar, setAvatar] = useState(config.avatar ?? null);
  const [error, setError] = useState("");

  const fileRef = useRef(null);

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const handleGuardar = () => {
    // Valida contraseña si se intenta cambiar
    if (password.trim()) {
      const passwordRegex =
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
      if (!passwordRegex.test(password.trim())) {
        setError(
          "La contraseña debe tener mínimo 8 caracteres, 1 dígito y 1 carácter especial",
        );
        return;
      }
    }
    setError("");
    // Prepara datos para actualizar en backend
    const datos = {};
    if (nombre.trim()) datos.nombre = nombre.trim();
    if (email.trim()) datos.email = email.trim();
    if (password.trim()) datos.password = password.trim();

    const nuevaConfig = JSON.stringify({ ...config, avatar });
    datos.configuracion = nuevaConfig;

    // Envía cambios al backend
    fetch(`http://localhost:8080/api/usuarios/${usuario.id}/perfil`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    })
      .then(async (r) => {
        if (!r.ok) {
          const msg = await r.text();
          setError(msg || "Error al guardar");
          return;
        }
        return r.json();
      })
      .then((usuarioActualizado) => {
        if (!usuarioActualizado) return;
        localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
        setPassword("");
        onSave(usuarioActualizado);
        onClose();
      })
      .catch(console.error);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ background: colors.bgSurface, color: colors.textPrimary }}
      >
        {/* Header */}
        <div className="modal-header">
          <h2>Editar perfil</h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
            style={{ color: colors.textMuted }}
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGuardar();
          }}
        >
          {/* Avatar */}
          <div className="modal-avatar-section">
            <div
              className="modal-avatar"
              style={{
                border: `2px solid ${colors.accentMain}`,
                background: colors.bgDark,
              }}
              onClick={() => fileRef.current.click()}
            >
              {avatar ? (
                <img src={avatar} alt="Avatar" className="modal-avatar-img" />
              ) : (
                <User size={36} color={colors.textMuted} />
              )}
              <div className="modal-avatar-overlay">
                <Pencil size={16} color="#fff" />
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatar}
            />
            {avatar
              ? <button type="button" className="modal-avatar-remove" onClick={() => setAvatar(null)} style={{ color: colors.textMuted }}>Eliminar foto</button>
              : <span className="modal-avatar-hint" style={{ color: colors.textMuted }}>Cambiar foto</span>
            }
          </div>

          {/* Campos */}
          <div className="modal-fields">
            <div className="modal-field">
              <label style={{ color: colors.textMuted }}>Nombre</label>
              <input
                type="text"
                className="modal-input"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={{
                  border: `1px solid ${colors.textMuted}`,
                  background: colors.bgDark,
                  color: colors.textPrimary,
                }}
              />
            </div>

            <div className="modal-field">
              <label style={{ color: colors.textMuted }}>Usuario</label>
              <input
                type="text"
                className="modal-input modal-input-readonly"
                value={usuario?.usuario ?? ""}
                readOnly
                style={{
                  border: `1px solid ${colors.textMuted}`,
                  background: colors.bgDark,
                  color: colors.textMuted,
                  cursor: "not-allowed",
                }}
              />
            </div>

            <div className="modal-field">
              <label style={{ color: colors.textMuted }}>Email</label>
              <input
                type="email"
                className="modal-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  border: `1px solid ${colors.textMuted}`,
                  background: colors.bgDark,
                  color: colors.textPrimary,
                }}
              />
            </div>

            <div className="modal-field">
              {!editarPassword ? (
                <button
                  type="button"
                  className="modal-change-password-btn"
                  onClick={() => setEditarPassword(true)}
                  style={{ color: colors.accentMain }}
                >
                  Cambiar contraseña
                </button>
              ) : (
                <>
                  <label style={{ color: colors.textMuted }}>
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    className="modal-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      border: `1px solid ${colors.textMuted}`,
                      background: colors.bgDark,
                      color: colors.textPrimary,
                    }}
                  />
                </>
              )}
            </div>
          </div>

          {error && <p className="modal-error">{error}</p>}

          <button
            type="submit"
            className="modal-save-btn"
            onClick={handleGuardar}
            style={{ background: colors.accentMain }}
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileModal;

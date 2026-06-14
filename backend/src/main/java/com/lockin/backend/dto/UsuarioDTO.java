package com.lockin.backend.dto;

import com.lockin.backend.model.Usuario;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UsuarioDTO {
    private int id;
    private String nombre;
    private String usuario;
    private String email;
    private String configuracion;
    private LocalDateTime fechaRegistro;

    public UsuarioDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.nombre = usuario.getNombre();
        this.usuario = usuario.getUsuario();
        this.email = usuario.getEmail();
        this.configuracion = usuario.getConfiguracion();
        this.fechaRegistro = usuario.getFechaRegistro();
    }
}
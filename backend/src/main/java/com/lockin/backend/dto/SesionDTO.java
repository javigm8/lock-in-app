package com.lockin.backend.dto;

import com.lockin.backend.model.Sesion;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SesionDTO {

    private Integer id;
    private Integer idUsuario;
    private Integer idTarea;
    private Integer idPerfilSesion;
    private Integer duracionMinutos;
    private Integer ciclosCompletados;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;

    public SesionDTO(Sesion sesion) {
        this.id = sesion.getId();
        this.idUsuario = sesion.getUsuario().getId();
        this.idTarea = sesion.getTarea() != null ? sesion.getTarea().getId() : null;
        this.idPerfilSesion = sesion.getPerfilSesion() != null ? sesion.getPerfilSesion().getId() : null;
        this.duracionMinutos = sesion.getDuracion();
        this.ciclosCompletados = sesion.getCiclosCompletos();
        this.fechaInicio = sesion.getFechaInicio();
    }
}
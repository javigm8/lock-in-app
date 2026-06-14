package com.lockin.backend.dto;

import com.lockin.backend.model.Tarea;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TareaDTO {
    private int id;
    private String titulo;
    private String descripcion;
    private String estado;
    private int prioridad;
    private Integer tiempoEstimado;
    private Integer tiempoReal;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaLimite;
    private int idUsuario;


    public TareaDTO(Tarea tarea) {
        this.id = tarea.getId();
        this.titulo = tarea.getTitulo();
        this.descripcion = tarea.getDescripcion();
        this.estado = tarea.getEstado();
        this.prioridad = tarea.getPrioridad();
        this.tiempoEstimado = tarea.getTiempoEstimado();
        this.tiempoReal = tarea.getTiempoReal();
        this.fechaCreacion = tarea.getFechaCreacion();
        this.fechaLimite = tarea.getFechaLimite();
        this.idUsuario = tarea.getUsuario().getId();
    }
}

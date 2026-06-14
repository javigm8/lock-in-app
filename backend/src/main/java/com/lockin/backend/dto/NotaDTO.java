package com.lockin.backend.dto;

import com.lockin.backend.model.Nota;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotaDTO {
    private int id;
    private String titulo;
    private String contenido;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaModificacion;
    private int idUsuario;
    private Integer idTarea;

    public NotaDTO(Nota nota) {
        this.id = nota.getId();
        this.titulo = nota.getTitulo();
        this.contenido = nota.getContenido();
        this.fechaCreacion = nota.getFechaCreacion();
        this.fechaModificacion = nota.getFechaModificacion();
        this.idUsuario = nota.getUsuario().getId();
        this.idTarea = nota.getTarea() != null ? nota.getTarea().getId() : null;
    }
}
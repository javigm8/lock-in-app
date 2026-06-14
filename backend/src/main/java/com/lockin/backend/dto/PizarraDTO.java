package com.lockin.backend.dto;

import com.lockin.backend.model.Pizarra;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PizarraDTO {

    private Integer id;
    private Integer idUsuario;
    private String titulo;
    private Object datos;
    private String version;
    private LocalDateTime fechaModificacion;

    public PizarraDTO(Pizarra pizarra) {
        this.id = pizarra.getId();
        this.idUsuario = pizarra.getUsuario().getId();
        this.titulo = pizarra.getTitulo();
        this.datos = pizarra.getDatos();
        this.version = pizarra.getVersion();
        this.fechaModificacion = pizarra.getFechaUltimaModificacion();
    }
}
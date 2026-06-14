package com.lockin.backend.dto;

import com.lockin.backend.model.Recordatorio;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RecordatorioDTO {

    private Integer id;
    private Integer idUsuario;
    private Integer idTarea;
    private String titulo;
    private String descripcion;
    private String repeticion;
    private Boolean activo;
    private Boolean completado;
    private LocalDateTime fechaHora;

    public RecordatorioDTO(Recordatorio recordatorio) {
        this.id = recordatorio.getId();
        this.idUsuario = recordatorio.getUsuario().getId();
        this.idTarea = recordatorio.getTarea() != null ? recordatorio.getTarea().getId() : null;
        this.titulo = recordatorio.getTitulo();
        this.descripcion = recordatorio.getDescripcion();
        this.repeticion = recordatorio.getRepeticion();
        this.activo = recordatorio.getActivo();
        this.completado = recordatorio.getCompletado();
        this.fechaHora = recordatorio.getFechaHora();
    }
}
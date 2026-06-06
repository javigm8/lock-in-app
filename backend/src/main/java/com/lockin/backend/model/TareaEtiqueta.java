package com.lockin.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tarea_etiqueta")
@Data
public class TareaEtiqueta {

    @EmbeddedId
    private TareaEtiquetaId id;

    @ManyToOne
    @MapsId("idTarea")
    @JoinColumn(name = "id_tarea")
    private Tarea tarea;

    @ManyToOne
    @MapsId("idEtiqueta")
    @JoinColumn(name = "id_etiqueta")
    private Etiqueta etiqueta;
}
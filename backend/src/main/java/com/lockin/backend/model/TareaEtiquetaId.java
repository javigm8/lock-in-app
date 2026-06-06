package com.lockin.backend.model;

import jakarta.persistence.Embeddable;
import lombok.Data;
import java.io.Serializable;

@Embeddable
@Data
public class TareaEtiquetaId implements Serializable {

    private Integer idTarea;
    private Integer idEtiqueta;
}
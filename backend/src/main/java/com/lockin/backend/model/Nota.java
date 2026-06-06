package com.lockin.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "nota")
@Data
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String titulo;

    private String contenido;

    private String enlace;

    @Column(name = "archivo_adjunto")
    private String archivoAdjunto;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_tarea")
    private Tarea tarea;
}
package com.lockin.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "tarea")
@Data
public class Tarea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String titulo;
    private String descripcion;

    @Column(nullable = false)
    private String estado;

    @Column(nullable = false)
    private Integer prioridad;

    @Column(name = "tiempo_estimado")
    private Integer tiempoEstimado;

    @Column(name = "tiempo_real")
    private Integer tiempoReal;

    @Column(name = "fecha_limite")
    private LocalDateTime fechaLimite;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;
}

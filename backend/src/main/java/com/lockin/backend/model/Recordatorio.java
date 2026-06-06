package com.lockin.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "recordatorio")
@Data
public class Recordatorio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_tarea")
    private Tarea tarea;

    @Column(nullable = false)
    private String titulo;

    private String descripcion;

    private String repeticion;

    @Column(nullable = false)
    private Boolean activo;

    @Column(nullable = false)
    private Boolean completado;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;
}
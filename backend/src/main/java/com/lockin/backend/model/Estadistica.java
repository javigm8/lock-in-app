package com.lockin.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "estadistica")
@Data
public class Estadistica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(name = "total_tiempo", nullable = false)
    private Integer totalTiempo;

    @Column(name = "sesiones_completadas", nullable = false)
    private Integer sesionesCompletadas;

    @Column(name = "tareas_completadas", nullable = false)
    private Integer tareasCompletadas;
}
package com.lockin.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "perfil_sesion")
@Data
public class PerfilSesion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @Column(nullable = false)
    private String nombre;

    @Column(name = "es_custom", nullable = false)
    private Boolean esCustom;

    @Column(nullable = false)
    private Integer duracion;

    @Column(nullable = false)
    private Integer ciclos;
}
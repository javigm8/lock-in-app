package com.lockin.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "etiqueta")
@Data
public class Etiqueta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private String nombre;

    private String color;
}
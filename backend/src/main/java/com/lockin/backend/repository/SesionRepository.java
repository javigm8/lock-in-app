package com.lockin.backend.repository;

import com.lockin.backend.model.Sesion;
import com.lockin.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SesionRepository extends JpaRepository<Sesion, Integer> {
    List<Sesion> findByUsuario(Usuario usuario);
}
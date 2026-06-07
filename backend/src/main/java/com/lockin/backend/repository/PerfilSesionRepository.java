package com.lockin.backend.repository;

import com.lockin.backend.model.PerfilSesion;
import com.lockin.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PerfilSesionRepository extends JpaRepository<PerfilSesion, Integer> {
    List<PerfilSesion> findByUsuario(Usuario usuario);
    List<PerfilSesion> findByUsuarioIsNull();
}
package com.lockin.backend.repository;

import com.lockin.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario,Integer> {
    boolean existsByUsuario(String usuario);
    boolean existsByEmail(String email);
    Usuario findByUsuario(String usuario);
    Usuario findByEmail(String email);
}

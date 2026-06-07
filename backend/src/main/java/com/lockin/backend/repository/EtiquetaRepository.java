package com.lockin.backend.repository;

import com.lockin.backend.model.Etiqueta;
import com.lockin.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EtiquetaRepository extends JpaRepository<Etiqueta, Integer> {
    List<Etiqueta> findByUsuario(Usuario usuario);
}
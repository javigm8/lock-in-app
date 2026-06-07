package com.lockin.backend.repository;

import com.lockin.backend.model.Estadistica;
import com.lockin.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EstadisticaRepository extends JpaRepository<Estadistica, Integer> {
    List<Estadistica> findByUsuario(Usuario usuario);
}
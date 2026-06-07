package com.lockin.backend.repository;

import com.lockin.backend.model.Tarea;
import com.lockin.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TareaRepository extends JpaRepository<Tarea, Integer> {
    List<Tarea> findByUsuario(Usuario usuario);
}
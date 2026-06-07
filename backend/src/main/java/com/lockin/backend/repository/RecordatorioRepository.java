package com.lockin.backend.repository;

import com.lockin.backend.model.Recordatorio;
import com.lockin.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RecordatorioRepository extends JpaRepository<Recordatorio, Integer> {
    List<Recordatorio> findByUsuario(Usuario usuario);
}
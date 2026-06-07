package com.lockin.backend.repository;

import com.lockin.backend.model.TareaEtiqueta;
import com.lockin.backend.model.TareaEtiquetaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TareaEtiquetaRepository extends JpaRepository<TareaEtiqueta, TareaEtiquetaId> {
}
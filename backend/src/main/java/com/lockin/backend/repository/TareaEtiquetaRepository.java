package com.lockin.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lockin.backend.model.TareaEtiqueta;
import com.lockin.backend.model.TareaEtiquetaId;

@Repository
public interface TareaEtiquetaRepository extends JpaRepository<TareaEtiqueta, TareaEtiquetaId> {
    List<TareaEtiqueta> findByTarea_Id(Integer idTarea);
}
package com.lockin.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lockin.backend.model.TareaEtiqueta;
import com.lockin.backend.model.TareaEtiquetaId;
import com.lockin.backend.repository.TareaEtiquetaRepository;

@Service
public class TareaEtiquetaService {

    private final TareaEtiquetaRepository tareaEtiquetaRepository;

    public TareaEtiquetaService(TareaEtiquetaRepository tareaEtiquetaRepository) {
        this.tareaEtiquetaRepository = tareaEtiquetaRepository;
    }

    public List<TareaEtiqueta> findByTaskId(Integer idTarea) {
        return tareaEtiquetaRepository.findByTarea_Id(idTarea);
    }

    public List<TareaEtiqueta> findAll() {
        return tareaEtiquetaRepository.findAll();
    }

    public TareaEtiqueta save(TareaEtiqueta tareaEtiqueta) {
        return tareaEtiquetaRepository.save(tareaEtiqueta);
    }

    public void deleteById(TareaEtiquetaId id) {
        tareaEtiquetaRepository.deleteById(id);
    }
}
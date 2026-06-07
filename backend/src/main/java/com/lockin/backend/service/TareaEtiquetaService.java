package com.lockin.backend.service;

import com.lockin.backend.model.TareaEtiqueta;
import com.lockin.backend.model.TareaEtiquetaId;
import com.lockin.backend.repository.TareaEtiquetaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TareaEtiquetaService {

    private final TareaEtiquetaRepository tareaEtiquetaRepository;

    public TareaEtiquetaService(TareaEtiquetaRepository tareaEtiquetaRepository) {
        this.tareaEtiquetaRepository = tareaEtiquetaRepository;
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
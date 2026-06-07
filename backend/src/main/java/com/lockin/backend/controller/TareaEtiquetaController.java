package com.lockin.backend.controller;

import com.lockin.backend.model.TareaEtiqueta;
import com.lockin.backend.model.TareaEtiquetaId;
import com.lockin.backend.service.TareaEtiquetaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tarea-etiqueta")
public class TareaEtiquetaController {

    private final TareaEtiquetaService tareaEtiquetaService;

    public TareaEtiquetaController(TareaEtiquetaService tareaEtiquetaService) {
        this.tareaEtiquetaService = tareaEtiquetaService;
    }

    @GetMapping
    public List<TareaEtiqueta> findAll() {
        return tareaEtiquetaService.findAll();
    }

    @PostMapping
    public TareaEtiqueta save(@RequestBody TareaEtiqueta tareaEtiqueta) {
        return tareaEtiquetaService.save(tareaEtiqueta);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteById(@RequestBody TareaEtiquetaId id) {
        tareaEtiquetaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
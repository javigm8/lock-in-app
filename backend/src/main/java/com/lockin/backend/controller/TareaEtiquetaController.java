package com.lockin.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lockin.backend.model.TareaEtiqueta;
import com.lockin.backend.model.TareaEtiquetaId;
import com.lockin.backend.service.TareaEtiquetaService;

@RestController
@RequestMapping("/api/tarea-etiqueta")
public class TareaEtiquetaController {

    private final TareaEtiquetaService tareaEtiquetaService;

    public TareaEtiquetaController(TareaEtiquetaService tareaEtiquetaService) {
        this.tareaEtiquetaService = tareaEtiquetaService;
    }

    @GetMapping("/tarea/{idTarea}")
    public List<TareaEtiqueta> findByTarea(@PathVariable Integer idTarea) {
        return tareaEtiquetaService.findByTaskId(idTarea);
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
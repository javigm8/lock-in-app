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

import com.lockin.backend.model.Etiqueta;
import com.lockin.backend.model.Tarea;
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
    public ResponseEntity<TareaEtiqueta> save(@RequestBody java.util.Map<String, Integer> body) {
        TareaEtiquetaId id = new TareaEtiquetaId();
        id.setIdTarea(body.get("idTarea"));
        id.setIdEtiqueta(body.get("idEtiqueta"));

        TareaEtiqueta te = new TareaEtiqueta();
        te.setId(id);

        Tarea tarea = new Tarea();
        tarea.setId(id.getIdTarea());
        te.setTarea(tarea);

        Etiqueta etiqueta = new Etiqueta();
        etiqueta.setId(id.getIdEtiqueta());
        te.setEtiqueta(etiqueta);

        return ResponseEntity.ok(tareaEtiquetaService.save(te));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteById(@RequestBody TareaEtiquetaId id) {
        tareaEtiquetaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
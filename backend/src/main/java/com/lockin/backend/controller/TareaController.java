package com.lockin.backend.controller;

import com.lockin.backend.model.Tarea;
import com.lockin.backend.service.TareaService;
import com.lockin.backend.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tareas")
public class TareaController {
    private final TareaService tareaService;
    private final UsuarioService usuarioService;

    public TareaController(TareaService tareaService, UsuarioService usuarioService) {
        this.tareaService = tareaService;
        this.usuarioService = usuarioService;
    }

    //Obtener listado de tareas de un usuario (mediante su ID)
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Tarea>> getTareas(@PathVariable Integer idUsuario) {
        return usuarioService.findById(idUsuario)
                .map(usuario -> ResponseEntity.ok(tareaService.findByUsuario(usuario)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tarea> findById(@PathVariable Integer id) {
        return tareaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Tarea save(@RequestBody Tarea tarea) {
        return tareaService.save(tarea);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Integer id) {
        tareaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

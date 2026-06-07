package com.lockin.backend.controller;

import com.lockin.backend.model.Estadistica;
import com.lockin.backend.model.Usuario;
import com.lockin.backend.service.EstadisticaService;
import com.lockin.backend.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/estadisticas")
public class EstadisticaController {

    private final EstadisticaService estadisticaService;
    private final UsuarioService usuarioService;

    public EstadisticaController(EstadisticaService estadisticaService, UsuarioService usuarioService) {
        this.estadisticaService = estadisticaService;
        this.usuarioService = usuarioService;
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<Estadistica> findByUsuario(@PathVariable Integer idUsuario) {
        Usuario usuario = usuarioService.findById(idUsuario).orElseThrow();
        return estadisticaService.findByUsuario(usuario);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Estadistica> findById(@PathVariable Integer id) {
        return estadisticaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Estadistica save(@RequestBody Estadistica estadistica) {
        return estadisticaService.save(estadistica);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Integer id) {
        estadisticaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
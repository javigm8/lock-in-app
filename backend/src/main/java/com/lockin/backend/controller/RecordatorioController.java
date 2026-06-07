package com.lockin.backend.controller;

import com.lockin.backend.model.Recordatorio;
import com.lockin.backend.model.Usuario;
import com.lockin.backend.service.RecordatorioService;
import com.lockin.backend.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/recordatorios")
public class RecordatorioController {

    private final RecordatorioService recordatorioService;
    private final UsuarioService usuarioService;

    public RecordatorioController(RecordatorioService recordatorioService, UsuarioService usuarioService) {
        this.recordatorioService = recordatorioService;
        this.usuarioService = usuarioService;
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<Recordatorio> findByUsuario(@PathVariable Integer idUsuario) {
        Usuario usuario = usuarioService.findById(idUsuario).orElseThrow();
        return recordatorioService.findByUsuario(usuario);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recordatorio> findById(@PathVariable Integer id) {
        return recordatorioService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Recordatorio save(@RequestBody Recordatorio recordatorio) {
        return recordatorioService.save(recordatorio);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Integer id) {
        recordatorioService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
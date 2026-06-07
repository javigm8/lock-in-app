package com.lockin.backend.controller;

import com.lockin.backend.model.Etiqueta;
import com.lockin.backend.model.Usuario;
import com.lockin.backend.service.EtiquetaService;
import com.lockin.backend.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/etiquetas")
public class EtiquetaController {

    private final EtiquetaService etiquetaService;
    private final UsuarioService usuarioService;

    public EtiquetaController(EtiquetaService etiquetaService, UsuarioService usuarioService) {
        this.etiquetaService = etiquetaService;
        this.usuarioService = usuarioService;
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<Etiqueta> findByUsuario(@PathVariable Integer idUsuario) {
        Usuario usuario = usuarioService.findById(idUsuario).orElseThrow();
        return etiquetaService.findByUsuario(usuario);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Etiqueta> findById(@PathVariable Integer id) {
        return etiquetaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Etiqueta save(@RequestBody Etiqueta etiqueta) {
        return etiquetaService.save(etiqueta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Integer id) {
        etiquetaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
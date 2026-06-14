package com.lockin.backend.controller;

import com.lockin.backend.dto.SesionDTO;
import com.lockin.backend.model.Sesion;
import com.lockin.backend.model.Usuario;
import com.lockin.backend.service.SesionService;
import com.lockin.backend.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sesiones")
public class SesionController {

    private final SesionService sesionService;
    private final UsuarioService usuarioService;

    public SesionController(SesionService sesionService, UsuarioService usuarioService) {
        this.sesionService = sesionService;
        this.usuarioService = usuarioService;
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<SesionDTO> findByUsuario(@PathVariable Integer idUsuario) {
        Usuario usuario = usuarioService.findById(idUsuario).orElseThrow();
        return sesionService.findByUsuario(usuario)
                .stream()
                .map(SesionDTO::new)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SesionDTO> findById(@PathVariable Integer id) {
        return sesionService.findById(id)
                .map(SesionDTO::new)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Sesion save(@RequestBody Sesion sesion) {
        return sesionService.save(sesion);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Integer id) {
        sesionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
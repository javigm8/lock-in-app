package com.lockin.backend.controller;

import com.lockin.backend.model.PerfilSesion;
import com.lockin.backend.model.Usuario;
import com.lockin.backend.service.PerfilSesionService;
import com.lockin.backend.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/perfiles-sesion")
public class PerfilSesionController {

    private final PerfilSesionService perfilSesionService;
    private final UsuarioService usuarioService;

    public PerfilSesionController(PerfilSesionService perfilSesionService, UsuarioService usuarioService) {
        this.perfilSesionService = perfilSesionService;
        this.usuarioService = usuarioService;
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<PerfilSesion> findByUsuario(@PathVariable Integer idUsuario) {
        Usuario usuario = usuarioService.findById(idUsuario).orElseThrow();
        return perfilSesionService.findByUsuario(usuario);
    }

    @GetMapping("/predefinidos")
    public List<PerfilSesion> findPredefinidos() {
        return perfilSesionService.findPredefinidos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PerfilSesion> findById(@PathVariable Integer id) {
        return perfilSesionService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public PerfilSesion save(@RequestBody PerfilSesion perfilSesion) {
        return perfilSesionService.save(perfilSesion);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Integer id) {
        perfilSesionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
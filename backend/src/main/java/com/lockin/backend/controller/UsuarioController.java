package com.lockin.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lockin.backend.dto.UsuarioDTO;
import com.lockin.backend.model.Usuario;
import com.lockin.backend.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;

    public UsuarioController(UsuarioService usuarioService, PasswordEncoder passwordEncoder) {
        this.usuarioService = usuarioService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<UsuarioDTO> findAll() {
        return usuarioService.findAll()
                .stream()
                .map(UsuarioDTO::new)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> findById(@PathVariable Integer id) {
        return usuarioService.findById(id)
                .map(usuario -> ResponseEntity.ok(new UsuarioDTO(usuario)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public UsuarioDTO save(@RequestBody Usuario usuario) {
        return new UsuarioDTO(usuarioService.save(usuario));
    }

    @PutMapping("/{id}/configuracion")
    public ResponseEntity<UsuarioDTO> updateConfiguracion(
            @PathVariable Integer id,
            @RequestBody String configuracion) {
        return usuarioService.findById(id)
                .map(usuario -> {
                    usuario.setConfiguracion(configuracion);
                    return ResponseEntity.ok(new UsuarioDTO(usuarioService.save(usuario)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/perfil")
    public ResponseEntity<?> updatePerfil(
            @PathVariable Integer id,
            @RequestBody Map<String, String> datos) {
        return usuarioService.findById(id)
                .map(usuario -> {
                    String nuevoNombre = datos.get("nombre");
                    String nuevoEmail = datos.get("email");
                    String nuevaPassword = datos.get("password");
                    String nuevaConfiguracion = datos.get("configuracion");

                    if (nuevoNombre != null && !nuevoNombre.isBlank())
                        usuario.setNombre(nuevoNombre);

                    if (nuevoEmail != null && !nuevoEmail.isBlank()) {
                        if (!nuevoEmail.equals(usuario.getEmail()) && usuarioService.existsByEmail(nuevoEmail))
                            return ResponseEntity.badRequest().body("El email ya está en uso");
                        usuario.setEmail(nuevoEmail);
                    }

                    if (nuevaPassword != null && !nuevaPassword.isBlank())
                        usuario.setPasswordHash(passwordEncoder.encode(nuevaPassword));

                    if (nuevaConfiguracion != null && !nuevaConfiguracion.isBlank())
                        usuario.setConfiguracion(nuevaConfiguracion);

                    return ResponseEntity.ok((Object) new UsuarioDTO(usuarioService.save(usuario)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Integer id) {
        usuarioService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

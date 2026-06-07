package com.lockin.backend.controller;

import com.lockin.backend.model.Usuario;
import com.lockin.backend.security.JwtUtil;
import com.lockin.backend.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UsuarioService usuarioService, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.usuarioService = usuarioService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Usuario usuario) {
        if (usuarioService.existsByUsuario(usuario.getUsuario())) {
            return ResponseEntity.badRequest().body("El nombre usuario ya está en uso");
        }
        if (usuarioService.existsByEmail(usuario.getEmail())) {
            return ResponseEntity.badRequest().body("El email ya está en uso");
        }
        usuario.setPasswordHash(passwordEncoder.encode(usuario.getPasswordHash()));
        usuario.setFechaRegistro(LocalDateTime.now());
        usuarioService.save(usuario);
        return ResponseEntity.ok("Usuario registrado correctamente");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
        String username = credenciales.get("usuario");
        String password = credenciales.get("password");

        Usuario usuario = usuarioService.findByUsuario(username);
        if (usuario == null || !passwordEncoder.matches(password, usuario.getPasswordHash())) {
            return ResponseEntity.badRequest().body("Credenciales incorrectas");
        }

        String token = jwtUtil.generateToken(username);
        return ResponseEntity.ok(Map.of("token", token));
    }
}

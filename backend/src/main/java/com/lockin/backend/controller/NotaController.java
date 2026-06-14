package com.lockin.backend.controller;

import com.lockin.backend.dto.NotaDTO;
import com.lockin.backend.model.Nota;
import com.lockin.backend.model.Usuario;
import com.lockin.backend.service.NotaService;
import com.lockin.backend.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notas")
public class NotaController {
    private final NotaService notaService;
    private final UsuarioService usuarioService;

    public NotaController(NotaService notaService, UsuarioService usuarioService) {
        this.notaService = notaService;
        this.usuarioService = usuarioService;
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<NotaDTO> findByUsuario(@PathVariable Integer idUsuario) {
        Usuario usuario = usuarioService.findById(idUsuario).orElseThrow();
        return notaService.findByUsuario(usuario)
                .stream()
                .map(NotaDTO::new)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotaDTO> findById(@PathVariable Integer id) {
        return notaService.findById(id)
                .map(nota -> ResponseEntity.ok(new NotaDTO(nota)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public NotaDTO save(@RequestBody Nota nota) {
        return new NotaDTO(notaService.save(nota));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Integer id) {
        notaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

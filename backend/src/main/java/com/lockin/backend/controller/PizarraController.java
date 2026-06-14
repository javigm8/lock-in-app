package com.lockin.backend.controller;

import com.lockin.backend.dto.PizarraDTO;
import com.lockin.backend.model.Pizarra;
import com.lockin.backend.model.Usuario;
import com.lockin.backend.service.PizarraService;
import com.lockin.backend.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pizarras")
public class PizarraController {
    private final PizarraService pizarraService;
    private final UsuarioService usuarioService;

    public PizarraController(PizarraService pizarraService, UsuarioService usuarioService) {
        this.pizarraService = pizarraService;
        this.usuarioService = usuarioService;
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<PizarraDTO> findByUsuario(@PathVariable Integer idUsuario) {
        Usuario usuario = usuarioService.findById(idUsuario).orElseThrow();
        return pizarraService.findByUsuario(usuario)
                .stream()
                .map(PizarraDTO::new)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PizarraDTO> findById(@PathVariable Integer id) {
        return pizarraService.findById(id)
                .map(PizarraDTO::new)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Pizarra save(@RequestBody Pizarra pizarra) {
        return pizarraService.save(pizarra);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Integer id) {
        pizarraService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
package com.lockin.backend.service;

import com.lockin.backend.model.Nota;
import com.lockin.backend.model.Usuario;
import com.lockin.backend.repository.NotaRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class NotaService {

    private final NotaRepository notaRepository;

    public NotaService(NotaRepository notaRepository) {
        this.notaRepository = notaRepository;
    }

    public List<Nota> findByUsuario(Usuario usuario) {
        return notaRepository.findByUsuario(usuario);
    }

    public Optional<Nota> findById(Integer id) {
        return notaRepository.findById(id);
    }

    public Nota save(Nota nota) {
        return notaRepository.save(nota);
    }

    public void deleteById(Integer id) {
        notaRepository.deleteById(id);
    }
}
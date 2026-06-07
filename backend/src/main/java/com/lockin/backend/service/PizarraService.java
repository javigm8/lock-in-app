package com.lockin.backend.service;

import com.lockin.backend.model.Pizarra;
import com.lockin.backend.model.Usuario;
import com.lockin.backend.repository.PizarraRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PizarraService {

    private final PizarraRepository pizarraRepository;

    public PizarraService(PizarraRepository pizarraRepository) {
        this.pizarraRepository = pizarraRepository;
    }

    public List<Pizarra> findByUsuario(Usuario usuario) {
        return pizarraRepository.findByUsuario(usuario);
    }

    public Optional<Pizarra> findById(Integer id) {
        return pizarraRepository.findById(id);
    }

    public Pizarra save(Pizarra pizarra) {
        return pizarraRepository.save(pizarra);
    }

    public void deleteById(Integer id) {
        pizarraRepository.deleteById(id);
    }
}
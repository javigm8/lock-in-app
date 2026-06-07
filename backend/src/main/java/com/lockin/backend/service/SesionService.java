package com.lockin.backend.service;

import com.lockin.backend.model.Sesion;
import com.lockin.backend.model.Usuario;
import com.lockin.backend.repository.SesionRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SesionService {

    private final SesionRepository sesionRepository;

    public SesionService(SesionRepository sesionRepository) {
        this.sesionRepository = sesionRepository;
    }

    public List<Sesion> findByUsuario(Usuario usuario) {
        return sesionRepository.findByUsuario(usuario);
    }

    public Optional<Sesion> findById(Integer id) {
        return sesionRepository.findById(id);
    }

    public Sesion save(Sesion sesion) {
        return sesionRepository.save(sesion);
    }

    public void deleteById(Integer id) {
        sesionRepository.deleteById(id);
    }
}
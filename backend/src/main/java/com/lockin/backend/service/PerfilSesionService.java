package com.lockin.backend.service;

import com.lockin.backend.model.PerfilSesion;
import com.lockin.backend.model.Usuario;
import com.lockin.backend.repository.PerfilSesionRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PerfilSesionService {

    private final PerfilSesionRepository perfilSesionRepository;

    public PerfilSesionService(PerfilSesionRepository perfilSesionRepository) {
        this.perfilSesionRepository = perfilSesionRepository;
    }

    public List<PerfilSesion> findByUsuario(Usuario usuario) {
        return perfilSesionRepository.findByUsuario(usuario);
    }

    public List<PerfilSesion> findPredefinidos() {
        return perfilSesionRepository.findByUsuarioIsNull();
    }

    public Optional<PerfilSesion> findById(Integer id) {
        return perfilSesionRepository.findById(id);
    }

    public PerfilSesion save(PerfilSesion perfilSesion) {
        return perfilSesionRepository.save(perfilSesion);
    }

    public void deleteById(Integer id) {
        perfilSesionRepository.deleteById(id);
    }
}
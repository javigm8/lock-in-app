package com.lockin.backend.service;

import com.lockin.backend.model.Etiqueta;
import com.lockin.backend.model.Usuario;
import com.lockin.backend.repository.EtiquetaRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EtiquetaService {

    private final EtiquetaRepository etiquetaRepository;

    public EtiquetaService(EtiquetaRepository etiquetaRepository) {
        this.etiquetaRepository = etiquetaRepository;
    }

    public List<Etiqueta> findByUsuario(Usuario usuario) {
        return etiquetaRepository.findByUsuario(usuario);
    }

    public Optional<Etiqueta> findById(Integer id) {
        return etiquetaRepository.findById(id);
    }

    public Etiqueta save(Etiqueta etiqueta) {
        return etiquetaRepository.save(etiqueta);
    }

    public void deleteById(Integer id) {
        etiquetaRepository.deleteById(id);
    }
}
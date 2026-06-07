package com.lockin.backend.service;

import com.lockin.backend.model.Estadistica;
import com.lockin.backend.model.Usuario;
import com.lockin.backend.repository.EstadisticaRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EstadisticaService {

    private final EstadisticaRepository estadisticaRepository;

    public EstadisticaService(EstadisticaRepository estadisticaRepository) {
        this.estadisticaRepository = estadisticaRepository;
    }

    public List<Estadistica> findByUsuario(Usuario usuario) {
        return estadisticaRepository.findByUsuario(usuario);
    }

    public Optional<Estadistica> findById(Integer id) {
        return estadisticaRepository.findById(id);
    }

    public Estadistica save(Estadistica estadistica) {
        return estadisticaRepository.save(estadistica);
    }

    public void deleteById(Integer id) {
        estadisticaRepository.deleteById(id);
    }
}
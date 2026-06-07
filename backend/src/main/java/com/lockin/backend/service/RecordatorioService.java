package com.lockin.backend.service;

import com.lockin.backend.model.Recordatorio;
import com.lockin.backend.model.Usuario;
import com.lockin.backend.repository.RecordatorioRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RecordatorioService {

    private final RecordatorioRepository recordatorioRepository;

    public RecordatorioService(RecordatorioRepository recordatorioRepository) {
        this.recordatorioRepository = recordatorioRepository;
    }

    public List<Recordatorio> findByUsuario(Usuario usuario) {
        return recordatorioRepository.findByUsuario(usuario);
    }

    public Optional<Recordatorio> findById(Integer id) {
        return recordatorioRepository.findById(id);
    }

    public Recordatorio save(Recordatorio recordatorio) {
        return recordatorioRepository.save(recordatorio);
    }

    public void deleteById(Integer id) {
        recordatorioRepository.deleteById(id);
    }
}
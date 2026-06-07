package com.lockin.backend.service;

import com.lockin.backend.model.Tarea;
import com.lockin.backend.model.Usuario;
import com.lockin.backend.repository.TareaRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TareaService {

    private final TareaRepository tareaRepository;

    public TareaService(TareaRepository tareaRepository) {
        this.tareaRepository = tareaRepository;
    }

    public List<Tarea> findByUsuario(Usuario usuario) {
        return tareaRepository.findByUsuario(usuario);
    }

    public Optional<Tarea> findById(Integer id) {
        return tareaRepository.findById(id);
    }

    public Tarea save(Tarea tarea) {
        return tareaRepository.save(tarea);
    }

    public void deleteById(Integer id) {
        tareaRepository.deleteById(id);
    }
}
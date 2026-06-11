package com.lockin.backend.service;

import com.lockin.backend.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DetallesUsuarioService implements UserDetailsService {
    private final UsuarioRepository usuarioRepository;

    public DetallesUsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username){
        if (!usuarioRepository.existsByUsuario(username)) {
            throw new UsernameNotFoundException(username);
        } else {
            var usuario = usuarioRepository.findByUsuario(username);
            return new User(usuario.getUsuario(), usuario.getPasswordHash(), List.of());
        }
    }
}

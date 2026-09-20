package com.pedidos360.backend.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.pedidos360.backend.exception.RecursoNoEncontradoException;
import com.pedidos360.backend.model.Usuario;
import com.pedidos360.backend.repository.UsuarioRepository;
import com.pedidos360.backend.security.UsuarioAutenticado;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario obtenerOCrearActual(Authentication authentication) {
        UsuarioAutenticado principal = (UsuarioAutenticado) authentication.getPrincipal();

        return usuarioRepository.findByCognitoSub(principal.cognitoSub())
                .orElseGet(() -> {
                    Usuario nuevo = new Usuario();
                    nuevo.setCognitoSub(principal.cognitoSub());
                    nuevo.setNombre(principal.nombre());
                    nuevo.setEmail(principal.email());
                    nuevo.setRol(principal.rol());
                    return usuarioRepository.save(nuevo);
                });
    }

    public Usuario obtenerPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado: " + id));
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }
}

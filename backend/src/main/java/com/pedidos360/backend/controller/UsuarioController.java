package com.pedidos360.backend.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pedidos360.backend.dto.UsuarioResponse;
import com.pedidos360.backend.model.Usuario;
import com.pedidos360.backend.service.UsuarioService;

@RestController
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/api/usuarios/me")
    public UsuarioResponse yo(Authentication authentication) {
        return aResponse(usuarioService.obtenerOCrearActual(authentication));
    }

    @GetMapping("/api/admin/usuarios")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UsuarioResponse> listarTodos() {
        return usuarioService.listarTodos().stream().map(this::aResponse).toList();
    }

    private UsuarioResponse aResponse(Usuario usuario) {
        return new UsuarioResponse(usuario.getId(), usuario.getNombre(), usuario.getEmail(), usuario.getRol());
    }
}

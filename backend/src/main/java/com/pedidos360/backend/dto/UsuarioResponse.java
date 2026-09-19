package com.pedidos360.backend.dto;

import com.pedidos360.backend.model.RolUsuario;

public record UsuarioResponse(
        Long id,
        String nombre,
        String email,
        RolUsuario rol) {
}

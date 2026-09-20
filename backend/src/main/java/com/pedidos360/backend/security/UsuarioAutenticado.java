package com.pedidos360.backend.security;

import com.pedidos360.backend.model.RolUsuario;

public record UsuarioAutenticado(String cognitoSub, String nombre, String email, RolUsuario rol) {
}

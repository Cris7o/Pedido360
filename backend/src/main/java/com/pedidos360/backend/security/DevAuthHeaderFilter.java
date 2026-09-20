package com.pedidos360.backend.security;

import java.io.IOException;
import java.util.List;

import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.pedidos360.backend.model.RolUsuario;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Reemplaza al validador de JWT de Cognito mientras ese servicio no existe.
 * Simula la misma identidad (sub + rol) que llegara en los claims del token real,
 * para poder desarrollar y probar toda la logica de autorizacion sin AWS.
 * Se activa solo con el perfil "local"; en "cognito" esto se apaga y entra
 * el JwtAuthenticationConverter real.
 */
@Component
@Profile("local")
public class DevAuthHeaderFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String sub = request.getHeader("X-Usuario-Sub");
        String rolHeader = request.getHeader("X-Rol");

        if (sub != null && rolHeader != null) {
            try {
                RolUsuario rol = RolUsuario.valueOf(rolHeader.toUpperCase());
                String nombre = request.getHeader("X-Nombre") != null ? request.getHeader("X-Nombre") : sub;
                String email = request.getHeader("X-Email") != null ? request.getHeader("X-Email")
                        : sub + "@dev.local";

                UsuarioAutenticado principal = new UsuarioAutenticado(sub, nombre, email, rol);
                var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + rol.name()));
                var authentication = new UsernamePasswordAuthenticationToken(principal, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (IllegalArgumentException ignored) {
                // rol invalido en el header -> sigue sin autenticar, la request cae en 401/403
            }
        }

        chain.doFilter(request, response);
    }
}

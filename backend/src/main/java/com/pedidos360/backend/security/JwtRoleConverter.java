package com.pedidos360.backend.security;

import java.util.List;
import java.util.Optional;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import com.pedidos360.backend.model.RolUsuario;

/**
 * Traduce un JWT de Cognito a la misma identidad (UsuarioAutenticado) que usa
 * DevAuthHeaderFilter en local, para que controllers y services no dependan
 * de si la autenticacion vino de un header de desarrollo o de un token real.
 * El grupo de Cognito (cognito:groups) debe llamarse igual que el RolUsuario:
 * CLIENTE, COCINA, REPARTIDOR o ADMIN.
 */
@Component
public class JwtRoleConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        List<String> grupos = Optional
                .ofNullable(jwt.getClaimAsStringList("cognito:groups"))
                .orElse(List.of());

        RolUsuario rol = grupos.stream()
                .map(this::aRolUsuario)
                .filter(java.util.Objects::nonNull)
                .findFirst()
                .orElse(null);

        String nombre = jwt.getClaimAsString("name");
        String email = jwt.getClaimAsString("email");
        UsuarioAutenticado principal = new UsuarioAutenticado(jwt.getSubject(), nombre, email, rol);

        List<SimpleGrantedAuthority> authorities = grupos.stream()
                .map(grupo -> new SimpleGrantedAuthority("ROLE_" + grupo.toUpperCase()))
                .toList();

        return new UsernamePasswordAuthenticationToken(principal, jwt, authorities);
    }

    private RolUsuario aRolUsuario(String grupo) {
        try {
            return RolUsuario.valueOf(grupo.toUpperCase());
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }
}

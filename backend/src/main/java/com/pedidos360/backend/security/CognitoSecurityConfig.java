package com.pedidos360.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Seguridad real con Cognito: valida issuer, audience, firma y vigencia del
 * JWT (a traves de spring.security.oauth2.resourceserver.jwt.issuer-uri) y
 * mapea los grupos de Cognito a roles con JwtRoleConverter. Se activa con
 * spring.profiles.active=cognito una vez que exista el User Pool.
 */
@Configuration
@Profile("cognito")
public class CognitoSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtRoleConverter jwtRoleConverter) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                        .anyRequest().authenticated())
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, e) -> RestErrorWriter.escribir(res, 401, "No autenticado"))
                        .accessDeniedHandler((req, res, e) -> RestErrorWriter.escribir(res, 403, "No autorizado")))
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtRoleConverter)));

        return http.build();
    }
}

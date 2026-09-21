package com.pedidos360.backend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Seguridad real con Cognito: valida issuer, audience, firma y vigencia del
 * JWT y mapea los grupos de Cognito a roles con JwtRoleConverter. Se activa
 * con spring.profiles.active=cognito una vez que exista el User Pool.
 *
 * Spring solo valida issuer/firma/vigencia por defecto: el audience hay que
 * chequearlo a mano contra el App Client ID, porque Cognito lo manda como
 * "aud" en el ID token pero como "client_id" en el access token.
 */
@Configuration
@Profile("cognito")
public class CognitoSecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String issuerUri;

    @Value("${cognito.app-client-id}")
    private String appClientId;

    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withIssuerLocation(issuerUri).build();

        OAuth2TokenValidator<Jwt> audienceValidator = jwt -> {
            boolean coincide = (jwt.getAudience() != null && jwt.getAudience().contains(appClientId))
                    || appClientId.equals(jwt.getClaimAsString("client_id"));
            return coincide
                    ? OAuth2TokenValidatorResult.success()
                    : OAuth2TokenValidatorResult.failure(
                            new OAuth2Error("invalid_token", "El audience/client_id del token no coincide", null));
        };

        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
                JwtValidators.createDefaultWithIssuer(issuerUri), audienceValidator));

        return decoder;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtDecoder jwtDecoder, JwtRoleConverter jwtRoleConverter)
            throws Exception {
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
                        .jwt(jwt -> jwt.decoder(jwtDecoder).jwtAuthenticationConverter(jwtRoleConverter)));

        return http.build();
    }
}

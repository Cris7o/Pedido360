package com.pedidos360.backend.security;

import java.io.IOException;
import java.time.Instant;

import jakarta.servlet.http.HttpServletResponse;

/**
 * Escribe el error directo en la respuesta en vez de usar response.sendError().
 * sendError() hace que Tomcat reenvie internamente a /error, lo que vuelve a
 * pasar por todo el filtro de seguridad; como DevAuthHeaderFilter es
 * "once-per-request" no se re-ejecuta en ese reenvio, la segunda pasada queda
 * anonima y termina pisando el 403 real con un 401.
 */
final class RestErrorWriter {

    private RestErrorWriter() {
    }

    static void escribir(HttpServletResponse response, int status, String mensaje) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.getWriter().write(
                "{\"timestamp\":\"%s\",\"status\":%d,\"error\":\"%s\"}".formatted(Instant.now(), status, mensaje));
    }
}

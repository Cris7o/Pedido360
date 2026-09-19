package com.pedidos360.backend.exception;

public class RolNoAutorizadoException extends RuntimeException {

    public RolNoAutorizadoException(String mensaje) {
        super(mensaje);
    }
}

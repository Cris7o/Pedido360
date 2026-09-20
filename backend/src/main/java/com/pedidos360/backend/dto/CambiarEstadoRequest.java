package com.pedidos360.backend.dto;

import com.pedidos360.backend.model.EstadoPedido;

import jakarta.validation.constraints.NotNull;

public class CambiarEstadoRequest {

    @NotNull(message = "estado es obligatorio")
    private EstadoPedido estado;

    public EstadoPedido getEstado() {
        return estado;
    }

    public void setEstado(EstadoPedido estado) {
        this.estado = estado;
    }
}

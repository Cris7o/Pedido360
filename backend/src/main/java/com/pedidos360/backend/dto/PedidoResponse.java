package com.pedidos360.backend.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import com.pedidos360.backend.model.EstadoPedido;

public record PedidoResponse(
        Long id,
        Long clienteId,
        EstadoPedido estado,
        Instant fechaCreacion,
        List<ItemPedidoResponse> items,
        BigDecimal total) {
}

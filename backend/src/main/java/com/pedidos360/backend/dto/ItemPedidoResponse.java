package com.pedidos360.backend.dto;

import java.math.BigDecimal;

public record ItemPedidoResponse(
        Long productoId,
        String nombreProducto,
        int cantidad,
        BigDecimal precioUnitario,
        BigDecimal subtotal) {
}

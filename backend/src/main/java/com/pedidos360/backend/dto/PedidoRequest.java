package com.pedidos360.backend.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

public class PedidoRequest {

    @NotEmpty(message = "El pedido debe tener al menos un item")
    @Valid
    private List<ItemPedidoRequest> items;

    public List<ItemPedidoRequest> getItems() {
        return items;
    }

    public void setItems(List<ItemPedidoRequest> items) {
        this.items = items;
    }
}

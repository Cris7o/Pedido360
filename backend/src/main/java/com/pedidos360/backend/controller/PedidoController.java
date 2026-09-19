package com.pedidos360.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.pedidos360.backend.dto.CambiarEstadoRequest;
import com.pedidos360.backend.dto.PedidoRequest;
import com.pedidos360.backend.dto.PedidoResponse;
import com.pedidos360.backend.model.EstadoPedido;
import com.pedidos360.backend.model.Usuario;
import com.pedidos360.backend.service.PedidoService;
import com.pedidos360.backend.service.UsuarioService;

import jakarta.validation.Valid;

@RestController
public class PedidoController {

    private final PedidoService pedidoService;
    private final UsuarioService usuarioService;

    public PedidoController(PedidoService pedidoService, UsuarioService usuarioService) {
        this.pedidoService = pedidoService;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/api/pedidos")
    @PreAuthorize("hasRole('CLIENTE')")
    @ResponseStatus(HttpStatus.CREATED)
    public PedidoResponse crear(@Valid @RequestBody PedidoRequest request, Authentication authentication) {
        Usuario cliente = usuarioService.obtenerOCrearActual(authentication);
        return pedidoService.crear(request, cliente);
    }

    @GetMapping("/api/pedidos/mios")
    @PreAuthorize("hasRole('CLIENTE')")
    public List<PedidoResponse> listarMios(Authentication authentication) {
        Usuario cliente = usuarioService.obtenerOCrearActual(authentication);
        return pedidoService.listarPorCliente(cliente);
    }

    @GetMapping("/api/admin/pedidos")
    @PreAuthorize("hasRole('ADMIN')")
    public List<PedidoResponse> listarTodos() {
        return pedidoService.listarTodos();
    }

    @GetMapping("/api/cocina/pedidos")
    @PreAuthorize("hasRole('COCINA')")
    public List<PedidoResponse> listarParaCocina() {
        return pedidoService.listarPorEstados(EstadoPedido.PENDIENTE, EstadoPedido.EN_PREPARACION);
    }

    @GetMapping("/api/repartidor/pedidos")
    @PreAuthorize("hasRole('REPARTIDOR')")
    public List<PedidoResponse> listarParaRepartidor() {
        return pedidoService.listarPorEstados(EstadoPedido.LISTO, EstadoPedido.EN_REPARTO);
    }

    @PatchMapping("/api/pedidos/{id}/estado")
    @PreAuthorize("hasAnyRole('CLIENTE', 'COCINA', 'REPARTIDOR', 'ADMIN')")
    public PedidoResponse cambiarEstado(@PathVariable Long id, @Valid @RequestBody CambiarEstadoRequest request,
            Authentication authentication) {
        Usuario solicitante = usuarioService.obtenerOCrearActual(authentication);
        return pedidoService.cambiarEstado(id, request.getEstado(), solicitante);
    }
}

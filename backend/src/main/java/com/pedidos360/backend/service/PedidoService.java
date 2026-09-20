package com.pedidos360.backend.service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

import com.pedidos360.backend.dto.ItemPedidoResponse;
import com.pedidos360.backend.dto.PedidoRequest;
import com.pedidos360.backend.dto.PedidoResponse;
import com.pedidos360.backend.exception.RecursoNoEncontradoException;
import com.pedidos360.backend.exception.RolNoAutorizadoException;
import com.pedidos360.backend.model.EstadoPedido;
import com.pedidos360.backend.model.ItemPedido;
import com.pedidos360.backend.model.Pedido;
import com.pedidos360.backend.model.Producto;
import com.pedidos360.backend.model.RolUsuario;
import com.pedidos360.backend.model.Usuario;
import com.pedidos360.backend.repository.PedidoRepository;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProductoService productoService;
    private final PedidoEstadoService pedidoEstadoService;

    public PedidoService(PedidoRepository pedidoRepository, ProductoService productoService,
            PedidoEstadoService pedidoEstadoService) {
        this.pedidoRepository = pedidoRepository;
        this.productoService = productoService;
        this.pedidoEstadoService = pedidoEstadoService;
    }

    public PedidoResponse crear(PedidoRequest request, Usuario cliente) {
        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setEstado(EstadoPedido.PENDIENTE);

        request.getItems().forEach(itemRequest -> {
            Producto producto = productoService.obtenerEntidad(itemRequest.getProductoId());
            if (!producto.isDisponible()) {
                throw new RecursoNoEncontradoException("Producto no disponible: " + producto.getId());
            }

            ItemPedido item = new ItemPedido();
            item.setPedido(pedido);
            item.setProducto(producto);
            item.setCantidad(itemRequest.getCantidad());
            item.setPrecioUnitario(producto.getPrecio());
            pedido.getItems().add(item);
        });

        return aResponse(pedidoRepository.save(pedido));
    }

    public List<PedidoResponse> listarPorCliente(Usuario cliente) {
        return pedidoRepository.findByCliente(cliente).stream().map(this::aResponse).toList();
    }

    public List<PedidoResponse> listarTodos() {
        return pedidoRepository.findAll().stream().map(this::aResponse).toList();
    }

    public List<PedidoResponse> listarPorEstados(EstadoPedido... estados) {
        List<EstadoPedido> permitidos = Arrays.asList(estados);
        return pedidoRepository.findAll().stream()
                .filter(pedido -> permitidos.contains(pedido.getEstado()))
                .map(this::aResponse)
                .toList();
    }

    public PedidoResponse cambiarEstado(Long pedidoId, EstadoPedido nuevoEstado, Usuario solicitante) {
        Pedido pedido = obtenerEntidad(pedidoId);

        if (nuevoEstado == EstadoPedido.CANCELADO
                && solicitante.getRol() == RolUsuario.CLIENTE
                && !pedido.getCliente().getId().equals(solicitante.getId())) {
            throw new RolNoAutorizadoException("Un cliente solo puede cancelar sus propios pedidos");
        }

        pedidoEstadoService.aplicarTransicion(pedido, nuevoEstado, solicitante.getRol());
        return aResponse(pedidoRepository.save(pedido));
    }

    private Pedido obtenerEntidad(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Pedido no encontrado: " + id));
    }

    private PedidoResponse aResponse(Pedido pedido) {
        List<ItemPedidoResponse> items = pedido.getItems().stream()
                .map(item -> new ItemPedidoResponse(
                        item.getProducto().getId(),
                        item.getProducto().getNombre(),
                        item.getCantidad(),
                        item.getPrecioUnitario(),
                        item.getPrecioUnitario().multiply(BigDecimal.valueOf(item.getCantidad()))))
                .toList();

        BigDecimal total = items.stream()
                .map(ItemPedidoResponse::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new PedidoResponse(
                pedido.getId(),
                pedido.getCliente().getId(),
                pedido.getEstado(),
                pedido.getFechaCreacion(),
                items,
                total);
    }
}

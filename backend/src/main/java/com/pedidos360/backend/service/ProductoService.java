package com.pedidos360.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.pedidos360.backend.dto.ProductoRequest;
import com.pedidos360.backend.dto.ProductoResponse;
import com.pedidos360.backend.exception.RecursoNoEncontradoException;
import com.pedidos360.backend.model.Producto;
import com.pedidos360.backend.repository.ProductoRepository;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public List<ProductoResponse> listarDisponibles() {
        return productoRepository.findAll().stream()
                .filter(Producto::isDisponible)
                .map(this::aResponse)
                .toList();
    }

    public List<ProductoResponse> listarTodos() {
        return productoRepository.findAll().stream()
                .map(this::aResponse)
                .toList();
    }

    public ProductoResponse crear(ProductoRequest request) {
        Producto producto = new Producto();
        aplicarRequest(producto, request);
        return aResponse(productoRepository.save(producto));
    }

    public ProductoResponse actualizar(Long id, ProductoRequest request) {
        Producto producto = obtenerEntidad(id);
        aplicarRequest(producto, request);
        return aResponse(productoRepository.save(producto));
    }

    public void desactivar(Long id) {
        Producto producto = obtenerEntidad(id);
        producto.setDisponible(false);
        productoRepository.save(producto);
    }

    Producto obtenerEntidad(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Producto no encontrado: " + id));
    }

    private void aplicarRequest(Producto producto, ProductoRequest request) {
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setDisponible(request.isDisponible());
    }

    private ProductoResponse aResponse(Producto producto) {
        return new ProductoResponse(
                producto.getId(),
                producto.getNombre(),
                producto.getDescripcion(),
                producto.getPrecio(),
                producto.isDisponible());
    }
}

package com.pedidos360.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pedidos360.backend.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
}

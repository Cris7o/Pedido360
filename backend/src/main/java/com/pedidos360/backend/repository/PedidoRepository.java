package com.pedidos360.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pedidos360.backend.model.Pedido;
import com.pedidos360.backend.model.Usuario;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByCliente(Usuario cliente);
}

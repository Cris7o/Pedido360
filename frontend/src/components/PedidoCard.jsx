import { useState } from 'react'
import EstadoPedidoBadge from './EstadoPedidoBadge'
import { accionesDisponibles, contarUnidades, formatearFecha, formatearMoneda } from '../lib/pedidos'

export default function PedidoCard({ pedido, rol, onCambiarEstado, enProceso = false }) {
  const acciones = accionesDisponibles(rol, pedido.estado)
  const unidades = contarUnidades(pedido)
  const [confirmando, setConfirmando] = useState(null)

  const ejecutar = (accion) => {
    // Las acciones destructivas piden confirmacion en la misma tarjeta: un
    // window.confirm nativo se bloquea o se suprime en algunos navegadores.
    if (accion.destructiva && confirmando !== accion.hacia) {
      setConfirmando(accion.hacia)
      return
    }

    setConfirmando(null)
    onCambiarEstado(pedido, accion)
  }

  return (
    <article className="pedido-card">
      <header className="pedido-card-head">
        <div>
          <h3>Pedido #{pedido.id}</h3>
          <p className="pedido-meta">
            {formatearFecha(pedido.fechaCreacion)} · {unidades}{' '}
            {unidades === 1 ? 'unidad' : 'unidades'}
          </p>
        </div>
        <EstadoPedidoBadge estado={pedido.estado} />
      </header>

      <ul className="pedido-items">
        {(pedido.items || []).map((item) => (
          <li key={`${pedido.id}-${item.productoId}`}>
            <span className="pedido-item-cantidad">{item.cantidad}×</span>
            <span className="pedido-item-nombre">{item.nombreProducto}</span>
            <span className="pedido-item-precio">{formatearMoneda(item.subtotal)}</span>
          </li>
        ))}
      </ul>

      <footer className="pedido-card-foot">
        <div className="pedido-total">
          <span>Total</span>
          <strong>{formatearMoneda(pedido.total)}</strong>
        </div>

        {acciones.length > 0 && (
          <div className="pedido-acciones">
            {acciones.map((accion) => (
              <button
                key={accion.hacia}
                type="button"
                className={accion.destructiva ? 'accion-destructiva' : 'accion-primaria'}
                disabled={enProceso}
                onClick={() => ejecutar(accion)}
              >
                {enProceso
                  ? 'Actualizando…'
                  : confirmando === accion.hacia
                    ? 'Sí, confirmar'
                    : accion.etiqueta}
              </button>
            ))}

            {confirmando && !enProceso && (
              <button type="button" className="accion-secundaria" onClick={() => setConfirmando(null)}>
                Volver
              </button>
            )}
          </div>
        )}

        {confirmando && !enProceso && (
          <p className="pedido-confirmacion" role="alert">
            Esta acción no se puede deshacer.
          </p>
        )}
      </footer>
    </article>
  )
}

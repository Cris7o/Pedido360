import PedidoCard from '../components/PedidoCard'

/**
 * Panel de cola de pedidos, reutilizado por cocina, repartidor, admin y cliente.
 * Cada vista le pasa su titulo, sus pedidos y que hacer al cambiar de estado.
 */
export default function PanelPedidos({
  titulo,
  descripcion,
  icono,
  pedidos,
  rol,
  onCambiarEstado,
  pedidoEnProceso,
  cargando,
  vacioTitulo = 'No hay pedidos por ahora',
  vacioTexto = 'Cuando llegue un pedido nuevo va a aparecer acá.',
}) {
  return (
    <section className="panel-rol" aria-labelledby={`panel-${rol.toLowerCase()}`}>
      <header className="panel-head">
        <div className="panel-head-icono" aria-hidden="true">
          {icono}
        </div>
        <div>
          <h2 id={`panel-${rol.toLowerCase()}`}>{titulo}</h2>
          <p>{descripcion}</p>
        </div>
        <span className="panel-contador" aria-live="polite">
          {cargando ? 'Cargando…' : `${pedidos.length} ${pedidos.length === 1 ? 'pedido' : 'pedidos'}`}
        </span>
      </header>

      {cargando && (
        <div className="pedido-lista" aria-hidden="true">
          {[0, 1, 2].map((slot) => (
            <div key={slot} className="pedido-card skeleton-pedido">
              <div className="skeleton skeleton-line skeleton-line-lg" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-line-sm" />
            </div>
          ))}
        </div>
      )}

      {!cargando && pedidos.length === 0 && (
        <div className="panel-vacio">
          <h3>{vacioTitulo}</h3>
          <p>{vacioTexto}</p>
        </div>
      )}

      {!cargando && pedidos.length > 0 && (
        <div className="pedido-lista">
          {pedidos.map((pedido) => (
            <PedidoCard
              key={pedido.id}
              pedido={pedido}
              rol={rol}
              onCambiarEstado={onCambiarEstado}
              enProceso={pedidoEnProceso === pedido.id}
            />
          ))}
        </div>
      )}
    </section>
  )
}

import { ETIQUETAS_ESTADO } from '../lib/pedidos'

export default function EstadoPedidoBadge({ estado }) {
  return (
    <span className={`estado-badge estado-${estado?.toLowerCase()}`}>
      <span className="estado-punto" aria-hidden="true" />
      {ETIQUETAS_ESTADO[estado] || estado}
    </span>
  )
}

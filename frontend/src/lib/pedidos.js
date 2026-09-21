export const ETIQUETAS_ESTADO = {
  PENDIENTE: 'Pendiente',
  EN_PREPARACION: 'En preparación',
  LISTO: 'Listo',
  EN_REPARTO: 'En reparto',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
}

/**
 * Espeja la maquina de estados del backend (PedidoEstadoService): si aqui se
 * ofrece una transicion que el backend no permite, la API responde 409 o 403.
 * Cancelar solo existe desde PENDIENTE.
 */
const ACCIONES_POR_ROL = {
  COCINA: [
    { desde: 'PENDIENTE', hacia: 'EN_PREPARACION', etiqueta: 'Comenzar preparación' },
    { desde: 'EN_PREPARACION', hacia: 'LISTO', etiqueta: 'Marcar como listo' },
  ],
  REPARTIDOR: [
    { desde: 'LISTO', hacia: 'EN_REPARTO', etiqueta: 'Tomar para reparto' },
    { desde: 'EN_REPARTO', hacia: 'ENTREGADO', etiqueta: 'Marcar entregado' },
  ],
  CLIENTE: [
    { desde: 'PENDIENTE', hacia: 'CANCELADO', etiqueta: 'Cancelar pedido', destructiva: true },
  ],
  ADMIN: [
    { desde: 'PENDIENTE', hacia: 'CANCELADO', etiqueta: 'Cancelar pedido', destructiva: true },
  ],
}

export function accionesDisponibles(rol, estado) {
  return (ACCIONES_POR_ROL[rol] || []).filter((accion) => accion.desde === estado)
}

export function formatearMoneda(valor) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(valor ?? 0))
}

export function formatearFecha(iso) {
  if (!iso) return ''

  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function contarUnidades(pedido) {
  return (pedido.items || []).reduce((suma, item) => suma + Number(item.cantidad || 0), 0)
}

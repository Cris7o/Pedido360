import { fetchAuthSession } from 'aws-amplify/auth'

/**
 * Las peticiones van al API Gateway, que valida el JWT con su authorizer de
 * Cognito antes de dejarlas pasar al backend en EC2. En desarrollo se puede
 * apuntar al backend local con VITE_API_URL=/api.
 */
const API_URL =
  import.meta.env.VITE_API_URL || 'https://v3fefvlaa5.execute-api.us-east-1.amazonaws.com/api'

/**
 * El backend necesita el ID token, no el access token: es el unico que trae
 * email, name y cognito:groups, que es de donde sale el rol del usuario.
 */
async function obtenerIdToken() {
  const sesion = await fetchAuthSession()
  const idToken = sesion.tokens?.idToken?.toString()

  if (!idToken) {
    throw new Error('Tu sesión expiró. Vuelve a iniciar sesión.')
  }

  return idToken
}

export async function apiRequest(path, options = {}) {
  const idToken = await obtenerIdToken()

  const respuesta = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
      ...(options.headers || {}),
    },
  })

  if (!respuesta.ok) {
    throw new Error(await mensajeDeError(respuesta))
  }

  const tipo = respuesta.headers.get('content-type') || ''
  return tipo.includes('application/json') ? respuesta.json() : null
}

async function mensajeDeError(respuesta) {
  if (respuesta.status === 401) return 'No autenticado. Vuelve a iniciar sesión.'
  if (respuesta.status === 403) return 'No tienes permiso para hacer esta acción.'

  const texto = await respuesta.text()

  try {
    const cuerpo = JSON.parse(texto)
    return cuerpo.error || cuerpo.message || texto
  } catch {
    return texto || 'Ocurrió un error en la solicitud.'
  }
}

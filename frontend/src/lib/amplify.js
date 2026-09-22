import { Amplify } from 'aws-amplify'

/**
 * Conexion con el User Pool de Cognito. Los identificadores no son secretos
 * (viajan al navegador igual), pero quedan como variables de entorno para
 * poder apuntar a otro pool sin tocar el codigo.
 */
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'us-east-1_mnVUsGOUF',
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '527u6ljg4op00e38v92dbmfkc2',
    },
  },
})

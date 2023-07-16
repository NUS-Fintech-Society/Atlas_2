import { randomUUID } from 'crypto'
import * as admin from 'firebase-admin'
import { env } from '~/env/server.mjs'

function initAuth() {
    const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_KEY)
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) }, randomUUID())
    return admin.auth()
}

export const adminAuth = initAuth()

import * as admin from 'firebase-admin'
import { env } from '~/env/server.mjs'

function initAuth() {
    if (admin.apps.length === 0) {
        const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_KEY)
        admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
    }
    return admin.auth()
}

export const adminAuth = initAuth()

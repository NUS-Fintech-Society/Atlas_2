import * as admin from 'firebase-admin'
import { env } from '~/env/server.mjs'

const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_KEY)

if (admin.app.length === 0) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
}

export const adminAuth = admin.auth()

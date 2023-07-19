import * as admin from 'firebase-admin'

function initDb() {
  if (admin.apps.length === 0) {
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
    admin.initializeApp({ projectId: Date.now().toString() })
  }
  return admin.firestore()
}

export const db = initDb()

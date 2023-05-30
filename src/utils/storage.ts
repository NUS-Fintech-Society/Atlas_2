import { initializeApp } from 'firebase/app'
import {
  ref,
  getStorage,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { env } from '~/env/client.mjs'

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_API_KEY,
  authDomain: env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_APP_ID,
}

const app = initializeApp(firebaseConfig)
export class StorageService {
  private static storage = getStorage(app)

  static async uploadFile(file: Blob, pathName: string) {
    const storageRef = ref(this.storage, pathName)
    await uploadBytes(storageRef, file)
    return await getDownloadURL(storageRef)
  }

  static async deleteFile(pathName: string) {
    const storageRef = ref(this.storage, pathName)
    await deleteObject(storageRef)
  }
}

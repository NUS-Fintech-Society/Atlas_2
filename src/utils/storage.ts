import { initializeApp } from 'firebase/app'
import {
  ref,
  getStorage,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
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

  // returns a list of URL associated with the path
  static async getFiles(pathName: string) {
    const storageRef = ref(this.storage, pathName)
    const urlList: string[] = []
    listAll(storageRef)
      .then((res) => {
        res.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            urlList.push(url)
          })
        })
      })
      .catch((err) => {
        console.log('Error while retrieving file from firestore: ', err)
      })
    return urlList
  }
}

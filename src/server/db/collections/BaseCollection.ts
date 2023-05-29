import { db } from '../firebase'
import {
  collection,
  addDoc,
  getDoc,
  doc,
  query,
  getDocs,
  where,
  type WithFieldValue,
  type DocumentData,
  type WhereFilterOp,
  type FieldPath,
} from 'firebase/firestore'

type Queries<T> = {
  fieldPath: keyof T
  direction: WhereFilterOp
  value: T[keyof T]
}

export abstract class BaseCollection<T> {
  protected abstract collectionName: string
  protected abstract objectName: string

  get collection() {
    return collection(db, this.collectionName)
  }

  async set(payload: T) {
    return await addDoc(
      this.collection,
      payload as WithFieldValue<DocumentData>
    )
  }

  async getById(id: string) {
    const docRef = doc(db, this.collectionName, id)
    const result = await getDoc(docRef)
    if (!result.exists) {
      throw Error(`The ${this.objectName} does not exist`)
    }
    return { ...result, id: result.id } as T
  }

  async queries(queries: Queries<T>[]) {
    const items = queries.map((q) => {
      return where(q.fieldPath as string | FieldPath, q.direction, q.value)
    })
    const q = query(this.collection, ...items)
    const snapshots = await getDocs(q)
    return snapshots.docs.map((doc) => {
      return { ...doc.data(), id: doc.id } as T
    })
  }
}

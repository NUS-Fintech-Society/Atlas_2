import { db } from '../admin_firebase'

export abstract class BaseCollection<T extends FirebaseFirestore.DocumentData> {
  protected abstract collectionName: string
  protected abstract objectName: string

  private get converter() {
    return {
      toFirestore: (data: T) => data,
      fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
        snap.data() as T,
    }
  }

  async set(payload: T) {
    if (payload.id !== undefined) {
      const id = payload.id

      delete payload.id

      await db
        .collection(this.collectionName)
        .withConverter(this.converter)
        .doc(id)
        .set(payload)

      return
    }

    await db.collection(this.collectionName).doc().set(payload)
  }
}

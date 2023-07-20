import { db } from '../../admin_firebase'

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

  private get collection() {
    return db.collection(this.collectionName).withConverter(this.converter)
  }

  private getDocRef(id?: string) {
    return id ? this.collection.doc(id) : this.collection.doc()
  }

  async set(payload: T) {
    if (payload.id !== undefined) {
      const id = payload.id

      delete payload.id

      await this.collection.doc(id).set(payload)

      return
    }

    await this.collection.doc().set(payload)
  }

  async getById(id: string) {
    const result = await this.collection.doc(id).get()

    if (!result.exists) {
      throw Error(`The ${this.objectName} does not exist`)
    }

    return { ...(result.data() as T), id }
  }

  async update(id: string, payload: Partial<T>) {
    await db.collection(this.collectionName).doc(id).update(payload)
  }

  async delete(id: string) {
    await this.collection.doc(id).delete()
  }

  async getAll() {
    return await this.collection.get().then((snapshot) => {
      const documents = snapshot.docs
      return documents.map((doc) => ({ ...(doc.data() as T), id: doc.id }))
    })
  }

  withTransaction(transaction: FirebaseFirestore.Transaction) {
    return {
      get: (id: string) => transaction.get(this.collection.doc(id)),
      update: (id: string, payload: Partial<T>) =>
        transaction.update(this.getDocRef(id) as any, payload as any),
      set: (payload: T, id?: string) =>
        transaction.set(this.getDocRef(id), payload),
      delete: (id: string) => transaction.delete(this.getDocRef(id)),
      queryBuilder: () =>
        new FirebaseQueryBuilder<T>(this.collectionName, transaction),
    }
  }
}

class FirebaseQueryBuilder<T> {
  private collectionRef: FirebaseFirestore.CollectionReference
  private query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>

  constructor(
    collectionName: string,
    private transaction: FirebaseFirestore.Transaction
  ) {
    this.collectionRef = db.collection(collectionName)
    this.query = this.collectionRef
  }

  where<K extends keyof T>(
    field: K,
    operator: FirebaseFirestore.WhereFilterOp,
    value: T[K]
  ): FirebaseQueryBuilder<T> {
    this.query = this.query.where(
      field as string | FirebaseFirestore.FieldPath,
      operator,
      value
    )
    return this
  }

  orderBy(
    field: string,
    direction: FirebaseFirestore.OrderByDirection = 'asc'
  ): FirebaseQueryBuilder<T> {
    this.query = this.query.orderBy(field, direction)
    return this
  }

  limit(limit: number): FirebaseQueryBuilder<T> {
    this.query = this.query.limit(limit)
    return this
  }

  async get(): Promise<
    FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
  > {
    return this.transaction.get(this.query)
  }
}

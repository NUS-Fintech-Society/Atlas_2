import { db } from "../firebase";

export async function dropCollection(collectionName: string) {
    const result = await db.collection(collectionName).get().then((snapshot) => snapshot.docs)
    await Promise.all(result.map(res => res.ref.delete()))
}
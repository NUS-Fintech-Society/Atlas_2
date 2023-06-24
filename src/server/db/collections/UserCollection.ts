import { BaseCollection } from './BaseCollection'
import type { User } from '../models/User'
import { where } from 'firebase/firestore'

class UserCollection extends BaseCollection<User> {
  protected override collectionName = 'users'
  protected override objectName = 'user'

  async findByDepartment(departments: string[]) {
    const querySnapshot = await this.queries([
      where('department', 'in', departments),
    ])

    const users = await Promise.all(
      querySnapshot.map(async (snapshot) => {
        const user = await this.getById(snapshot.id)
        return user
      })
    )

    return users
  }
}

const userCollection = new UserCollection()
export default userCollection

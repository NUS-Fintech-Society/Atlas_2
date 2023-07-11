import { BaseCollection } from './BaseCollection'
import type { User } from '../models/User'
import { where } from 'firebase/firestore'

class UserCollection extends BaseCollection<User> {
  protected override collectionName = 'users'
  protected override objectName = 'user'

  async findByDepartment(departments: string[]) {
    return await this.queries([
      where('department', 'in', departments),
    ])
  }
}

const userCollection = new UserCollection()
export default userCollection

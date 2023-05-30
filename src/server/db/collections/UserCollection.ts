import { BaseCollection } from './BaseCollection'
import type { User } from '../models/User'

class UserCollection extends BaseCollection<User> {
  protected override collectionName = 'users'
  protected override objectName = 'user'
}

const userCollection = new UserCollection()
export default userCollection

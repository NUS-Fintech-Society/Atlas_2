import type { User } from '../models/User'
import { BaseCollection } from './AdminBaseCollection'

class UserCollection extends BaseCollection<User> {
  protected override collectionName = 'users'
  protected override objectName = 'user'
}

export const userCollection = new UserCollection()

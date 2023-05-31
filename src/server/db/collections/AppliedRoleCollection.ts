import { BaseCollection } from './BaseCollection'
import type { AppliedRole } from '../models/AppliedRole'

class AppliedRoleCollection extends BaseCollection<AppliedRole> {
  protected override collectionName = 'appliedroles'
  protected override objectName = 'appliedrole'
}

const userCollection = new AppliedRoleCollection()
export default userCollection

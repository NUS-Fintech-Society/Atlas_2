import { BaseCollection } from './BaseCollection'
import type { AppliedRole } from '../../models/AppliedRole'

class AppliedRoleCollection extends BaseCollection<AppliedRole> {
  protected override collectionName = 'applied_roles'
  protected override objectName = 'applied role'
}

export const appliedRoleCollection = new AppliedRoleCollection()

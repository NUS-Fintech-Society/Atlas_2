import { userCollection } from '~/server/db/collections/admin/UserCollection'

export class PermissionCheckerController {
  /**
   * @remarks isAdmin are people who have special permission but are not co-director,
   * director or IA.
   *
   * @param userId
   * @returns
   */
  static async checkIfUserHasAdminPermission(userId: string) {
    const user = await userCollection.getById(userId)

    return (
      user.isAdmin ||
      user.role === 'Co-Director' ||
      user.role === 'Director' ||
      user.department === 'Internal Affairs'
    )
  }
}

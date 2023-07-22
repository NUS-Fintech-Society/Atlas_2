import dayjs from 'dayjs'
import {
  type Event,
  eventCollection,
} from '~/server/db/collections/admin/EventCollection'
import { userCollection } from '~/server/db/collections/admin/UserCollection'
import type { User } from '~/server/db/models/User'
import { PermissionCheckerController } from '../util/permission_checker_controller'

export type UpdateEventPayload = {
  name: string
  id: string
  startDate: Date
  endDate: Date
  departments: string[]
  attendees: string[]
  isQrRequired: boolean
}

export class UpdateEventController {
  private updatePayload: Partial<Event> = {}
  private payload?: UpdateEventPayload
  private previousEventSnapshot?: Event

  private removeAttendees() {
    const updatedAttendees = this.payload?.attendees

    /// Remove attendance
    this.updatePayload.invitedAttendees =
      this.previousEventSnapshot?.invitedAttendees.filter((attendee) => {
        return updatedAttendees?.includes(attendee.id as string)
      })
  }

  private async addAttendance() {
    /// Add attendance
    const currentUserIds = new Set(
      this.updatePayload.invitedAttendees?.map((attendee) => attendee.id)
    )

    const usersToAdd = this.payload?.attendees.filter((attendee) => {
      return !currentUserIds.has(attendee)
    })

    const newUsers = await Promise.all(
      (usersToAdd as string[]).map(async (id) => {
        const data = await userCollection.getById(id)
        return {
          name: data.name,
          id: data.id as string,
          attended: false,
          department: data.department,
          role: data.role,
        }
      })
    )

    this.updatePayload.invitedAttendees =
      this.updatePayload.invitedAttendees?.concat(newUsers) as User[]
  }

  private async recomputeAttendance() {
    this.removeAttendees()

    await this.addAttendance()

    this.updatePayload.attendees = this.updatePayload.invitedAttendees?.length
  }

  public async execute(payload: UpdateEventPayload, userId: string) {
    this.payload = payload

    const hasPermission =
      await PermissionCheckerController.checkIfUserHasAdminPermission(userId)

    if (!hasPermission) {
      throw Error('You do not have permission to update the event.')
    }

    this.previousEventSnapshot = await eventCollection.find(payload.id)

    if (!this.previousEventSnapshot) {
      throw Error('The event does not exist.')
    }

    this.updatePayload = {
      name: payload.name,
      startDate: payload.startDate,
      endDate: payload.endDate,
      departments: payload.departments,
      isQrRequired: payload.isQrRequired,
      hasStarted: dayjs(payload.startDate).isBefore(dayjs()),
    }

    await this.recomputeAttendance()

    await eventCollection.update(payload.id, this.updatePayload)
  }
}

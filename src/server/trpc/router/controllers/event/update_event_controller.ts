import dayjs from 'dayjs'
import {
  type Event,
  eventCollection,
} from '~/server/db/collections/admin/EventCollection'

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

  private recomputeAttendance() {
    /// Unmark all the attendance if the hasStarted has changed from true to false.
    const shouldUnmarkAttendance = this.previousEventSnapshot?.hasStarted && !this.updatePayload.hasStarted

    if (shouldUnmarkAttendance) {
      this.previousEventSnapshot?.invitedAttendees.forEach((attendee) => (attendee.attended = false))
    }

    const updatedAttendees = this.payload?.attendees

    this.updatePayload.invitedAttendees =
      this.previousEventSnapshot?.invitedAttendees.filter((attendee) => {
        return updatedAttendees?.includes(attendee.id)
      })

    this.updatePayload.attendees = this.updatePayload.invitedAttendees?.length
  }

  public async execute(payload: UpdateEventPayload) {
    this.payload = payload
    this.previousEventSnapshot = await eventCollection.getById(payload.id)

    this.updatePayload = {
      name: payload.name,
      startDate: payload.startDate,
      endDate: payload.endDate,
      isQrRequired: payload.isQrRequired,
      hasStarted: dayjs(payload.startDate).isBefore(dayjs()),
    }

    this.recomputeAttendance()

    await eventCollection.update(payload.id, this.updatePayload)
  }
}

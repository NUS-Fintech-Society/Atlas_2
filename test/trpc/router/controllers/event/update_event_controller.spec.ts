import { UpdateEventController } from '~/server/trpc/router/controllers/event/update_event_controller'
import { eventCollection } from '~/server/db/collections/admin/EventCollection'
import { dropCollection } from '../../../../util/dropCollection'
import dayjs from 'dayjs'

describe('update_event_controller', () => {
  const controller = new UpdateEventController()

  afterEach(async () => {
    await dropCollection('events')
  })

  /**
   * In the following test, we assume that the department remains the same but the following changes has been made.
   *
   * (1). Start date has been shifted to 3 days later ==> hasStarted should be false because the event has not started.
   * 
   * (2). If hasStarted has changed from true to false and the attendance is true, we need to unmark the attendance of
   * the user who has already marked.
   * 
   * (3). One of the attendees gets removed ==> attendee count gets updated and the array of invitedAttendee should be
   * updated.
   */
  test('If the attendance is marked and we remove one user, the attendance should still be correct', async () => {
    await eventCollection.set({
      attendees: 2,
      departments: ['Software Development'],
      endDate: dayjs().toDate(),
      hasStarted: true,
      id: 'test',
      invitedAttendees: [
        {
          attended: false,
          department: 'Software Development',
          id: 'michael',
          name: 'Michael',
        },
        {
          attended: true,
          department: 'Software Development',
          id: 'wenjun',
          name: 'Wen Jun',
        },
      ],
      name: 'Town Hall',
      isQrRequired: true,
      startDate: dayjs().toDate(),
    })

    await controller.execute({
      attendees: ['wenjun'],
      departments: ['Software Development'],
      endDate: dayjs().add(3, 'days').toDate(),
      id: 'test',
      isQrRequired: false,
      name: 'Gathering',
      startDate: dayjs().add(3, 'days').toDate(),
    })

    await expect(eventCollection.getById('test')).resolves.toMatchObject({
      attendees: 1,
      departments: ['Software Development'],
      name: "Gathering",
      invitedAttendees: [{
        attended: false,
        department: "Software Development",
        id: 'wenjun',
        name: 'Wen Jun'
      }],
      isQrRequired: false,
      hasStarted: false,
    })
  })

  test("If we add a new user to the event, the user should be added into the event collection and the updated count is correct", async () => {})
})

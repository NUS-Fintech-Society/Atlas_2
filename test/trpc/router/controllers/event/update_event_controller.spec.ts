import { UpdateEventController } from '~/server/trpc/router/controllers/event/update_event_controller'
import { eventCollection } from '~/server/db/collections/admin/EventCollection'
import { dropCollection } from '../../../../util/dropCollection'
import { userCollection } from '~/server/db/collections/admin/UserCollection'
import dayjs from 'dayjs'

describe('update_event_controller', () => {
  const controller = new UpdateEventController()

  const sample_user_one = {
    department: 'Software Development',
    email: 'jess@u.nus.edu',
    id: 'jess',
    isAdmin: true,
    name: 'Jess',
    personal_email: 'jess@gmail.com',
    role: 'Co-Director',
  }

  beforeEach(async () => {
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
  })

  afterEach(async () => {
    await dropCollection('events')
  })

  test('If the user does not have permission to update event, an error should be thrown.', async () => {
    await userCollection.set({
      ...sample_user_one,
      isAdmin: false,
      role: 'Software Engineer',
    })

    await expect(
      controller.execute(
        {
          attendees: ['wenjun', 'jess'],
          departments: ['Software Development'],
          endDate: dayjs().add(3, 'days').toDate(),
          id: 'test',
          isQrRequired: false,
          name: 'Gathering',
          startDate: dayjs().add(3, 'days').toDate(),
        },
        'jess'
      )
    ).rejects.toThrowError('You do not have permission to update the event.')
  })

  test('If the event does not exist, we should throw an error', async () => {
    await userCollection.set(sample_user_one)

    await expect(
      controller.execute(
        {
          attendees: ['wenjun', 'jess'],
          departments: ['Software Development'],
          endDate: dayjs().add(3, 'days').toDate(),
          id: 'test_two',
          isQrRequired: false,
          name: 'Gathering',
          startDate: dayjs().add(3, 'days').toDate(),
        },
        'jess'
      )
    ).rejects.toThrowError('The event does not exist.')
  })

  /**
   * In the following test, we assume that the department remains the same but the following changes has been made.
   *
   * (1). Start date has been shifted to 3 days later ==> hasStarted should be false because the event has not started.
   * (2). If other fields change, we change them accordingly.
   * (3). If we remove attendees, we should update the attendees accordingly. Similarly, if we add attendees, we add them
   * into the attendee.
   */
  test('If the attendance is marked and we remove one user, the attendance should still be correct', async () => {
    await userCollection.set(sample_user_one)

    await controller.execute(
      {
        attendees: ['wenjun', 'jess'],
        departments: ['Software Development'],
        endDate: dayjs().add(3, 'days').toDate(),
        id: 'test',
        isQrRequired: false,
        name: 'Gathering',
        startDate: dayjs().add(3, 'days').toDate(),
      },
      'jess'
    )

    await expect(eventCollection.getById('test')).resolves.toMatchObject({
      attendees: 2,
      departments: ['Software Development'],
      name: 'Gathering',
      invitedAttendees: [
        {
          attended: true,
          department: 'Software Development',
          id: 'wenjun',
          name: 'Wen Jun',
        },
        {
          attended: false,
          department: 'Software Development',
          id: 'jess',
          name: 'Jess',
        },
      ],
      isQrRequired: false,
      hasStarted: false,
    })
  })
})

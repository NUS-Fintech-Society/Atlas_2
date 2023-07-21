import { sendEmail } from '../email'

export type Payload = {
  name: string
  userId: string
  reason: string
}

function buildBody(payload: Payload[]) {
  const buildTable = `
  <table>
      <tr>
          <th>Matriculation Number</th>
          <th>Name</th>
          <th>Reason</th>
      </tr>
      ${payload.map((user) => {
        return `
              <tr>
                  <td>${user.userId}</td>
                  <td>${user.name}</td>
                  <td>${user.reason}</td>
              </tr>
          `
      })}
  </table>
  `

  return `
  Hi admin,
  <br />
  <p>
  There was an issue with uploading the following users into the database.
  Please make the necessary changes. If there are any further issues, please
  contact the HRMS Atlas team.
  </p>

  ${buildTable}
  <br />
  Thank You. <br />
  ATLAS HRMS Team
  `
}

export async function createMultipleUserFailureEmail(
  recipient: string,
  payload: Payload[]
) {
  if (!recipient || !payload.length) return

  await sendEmail(recipient, 'Immediate Action Required!', buildBody(payload))
}

import { EmailController } from '../email_controller'

export type Payload = {
  name: string
  userId: string
  reason: string
}

export class CreateMultipleUserFailureEmail {
  private payload: Payload[] = []

  private get body() {
    const buildTable = `
    <table>
        <tr>
            <th>Matriculation Number</th>
            <th>Name</th>
            <th>Reason</th>
        </tr>
        ${this.payload.map((user) => {
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

  public async execute(recipient: string, payload: Payload[]) {
    if (!recipient || !payload.length) return

    this.payload = payload

    await EmailController.sendEmail(
      recipient,
      'Immediate Action Required!',
      this.body
    )
  }
}

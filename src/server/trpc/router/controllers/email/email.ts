import { transporter } from '../../util/transporter'
import { env } from '~/env/server.mjs'

/**
 * @param recipient The recipient's email
 * @param subject In the subject
 * @param body The content of the email in html.
 */
export async function sendEmail(
  recipient: string,
  subject: string,
  body: string,
  cc?: string[]
) {
  await transporter.sendMail({
    from: env.GMAIL,
    to: recipient,
    cc,
    subject,
    html: body,
  })
}

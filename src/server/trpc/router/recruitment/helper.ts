import nodemailer from 'nodemailer'
import { env } from '~/env/server.mjs'

/**
 * Sends an email to the applicant after getting accepted
 *
 * @param email The email of the applicant to be sent
 * @param name The name of the applicant
 * @param appliedRole The applied role of the applicant
 * @param appliedDepartmnet The accompanying department for the applied role
 */
export async function sendOfferEmail(
  email: string,
  name: string,
  appliedRole: string,
  appliedDepartment: string
) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.GMAIL,
      pass: env.GMAIL_PASSWORD,
    },
  })

  return transporter.sendMail({
    from: env.GMAIL,
    to: email,
    subject: `Congratulations you've been offered the role of ${appliedRole} in the ${appliedDepartment} department!`,
    html: `
    Dear ${name},
    <br />
    <p> Due to your outstanding performance in the interview, we
    have offered you the role of ${appliedRole} in the 
    ${appliedDepartment} department! If you would like
    to accept this role, please do so at the HRMS website.
    </p>
    <a href="${env.NEXTAUTH_URL}">HRMS Website</a>
    <br />
    Thank You. <br /> 
    Fintech HR
    `,
  })
}

/**
 * Sends an email to the applicant after getting rejected
 *
 * @param email The email of the applicant to be sent
 * @param name The name of the applicant
 * @param appliedRole The applied role of the applicant
 * @param appliedDepartmnet The accompanying department for the applied role
 */
export async function sendRejectionEmail(
  email: string,
  name: string,
  appliedRole: string,
  appliedDepartment: string
) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.GMAIL,
      pass: env.GMAIL_PASSWORD,
    },
  })

  return transporter.sendMail({
    from: env.GMAIL,
    to: email,
    subject: `Thanks for your interest in Fintech Society`,
    html: `
    Dear ${name},
    <br />
    <p> Thank you for your application to Fintech Society for 
    the role of ${appliedRole} in the ${appliedDepartment} 
    department. Though your performance was great, we have 
    decided to pursue other applicants who appear to match 
    our needs and requirements more closely at this time. 
    Thank you again for your interest and please do not 
    hesitate to re-apply again in the future!
    </p>
    <a href="${env.NEXTAUTH_URL}">HRMS Website</a>
    <br />
    Thank You. <br /> 
    Fintech HR
    `,
  })
}

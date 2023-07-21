import { env } from '~/env/server.mjs'
import { sendEmail } from '../email'

function buildBody(email: string, password: string) {
  return `
    Dear User, <br />

    <h2> Thank you for applying to NUS Fintech Society! </h2>
    <p> 
    We are delighted to inform you that we have received your application 
    and would like to proceed forward with you into the next round.
    </p>

    <p> 
    An account has been created for you on our HRMS portal. You can 
    login to view the latest status of your application. Your account 
    credentials are as follows:
    </p>

    
    <p> Username: ${email} </p>
    <p> Password: ${password} </p>

    <p> The ATLAS portal URL is as follows: <a href="${env.DOMAIN}">${env.DOMAIN}</a></p>

    <p>Please ensure that you keep your login credentials secure. If you have any concerns 
    about the security of your account, don't hesitate to contact our support team immediately. 
    </p>

    <p>
    Thank you once again for your interest and we wish you the best of luck with your application!
    </p>

    <br />
    <strong style="color:#0d5295">Warmest Regards\n</strong>
    <p style="color:#0d5295">NUS FinTech Society</p>
    `
}

export async function sendNewApplicantEmail(email: string, password: string) {
  await sendEmail(email, 'New Account Created!', buildBody(email, password))
}

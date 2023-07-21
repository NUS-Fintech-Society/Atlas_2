import nodemailer from 'nodemailer'
import { env } from '~/env/server.mjs'

/**
 * Sends an email to the applicant after getting offer from director
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
 * Sends an email to the applicant after getting rejected by director
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
    subject: `Thanks for your interest for ${appliedRole} in NUS Fintech Society`,
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

/**
 * Sends an email to the applicant after applicant accepts the role
 *
 * @param email The email of the applicant to be sent
 * @param name The name of the applicant
 * @param appliedRole The applied role of the applicant
 * @param appliedDepartmnet The accompanying department for the applied role
 */
export async function sendAcceptanceEmail(
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
    subject: `You're now a member of Fintech Society!`,
    html: `
    Dear ${name},
    <br />
    <p> Welcome to NUS Fintech Society and thank you for accepting the role of ${appliedRole} in the ${appliedDepartment} 
    department. You are now an official member of the society and we hope that you will
    enjoy your experience here.
    </p>
    <a href="${env.NEXTAUTH_URL}">HRMS Website</a>

    <p> Here are a few items to take note of as you get started on your journey with us. </p>
 
    <h2>Means of Communication</h2>
    <p>
        We have decided to introduce DISCORD for the upcoming AY!! This is with the aim of fostering a stronger 
        community within our society by establishing avenues for members to better interact with each other. 
        Through our Discord group, you will also receive information regarding internships, hackathons, workshops, 
        giveaways, and a slew of other exciting opportunities! Do also look forward to connecting with your fellow 
        society members on Discord and participating in virtual gatherings whether it is a training session or a time 
        to just chill-out.
    </p>
    <p>
        Below are the links to join the <strong>respective communication channels</strong>. For the Telegram Internal 
        Chat (Private & Informal), you will only be added after submitting your details in the HRMS. As for your 
        department channels/groups, your respective director will contact you directly with the invitation links.
    </p>

    <p>
        Telegram Announcement Channel (Public & Official): <a href="https://t.me/+cLtVaXXO1EE2Yjc1">https://t.me/+cLtVaXXO1EE2Yjc1</a>
    </p>
    <p>
        Telegram Internal Chat Group (Private & Informal): <a href="https://t.me/+SIfqKteSlvRmZTM1">https://t.me/+SIfqKteSlvRmZTM1M</a>
    </p>
    <p>
        Discord Channel (Private & Informal): <a href="https://discord.gg/FxQ2dcGGWJ"> https://discord.gg/FxQ2dcGGWJ </a>
    </p>
    <p>Telegram Department Channel (Private & Informal): Once you have completed your submission of details you will be added to the telegram group.</p>

    <br />

    <h2>NUS Fintech Society Directory</h2>
    <p>All-you-need-to-know about who is in Fintech Society, their respective departments, and their expertise.</p>
    <p>https://docs.google.com/spreadsheets/d/164dLS7EP4wqIH0nPpEI3ZyRuvtbr-nIoUW9Q7w4njVU/edit?usp=sharing
    </p>

    <h2>Onboarding Slide Decks</h2>
    <p>To assist you in onboarding to our society, we have created an Onboarding Slide Deck and a Discord Slide Deck so do check them out!
    Once again, welcome to the NUS Fintech Society and we look forward to seeing you around.
</p>

<p>
NUS Fintech Society Onboarding Deck: <a href="https://docs.google.com/presentation/d/1icd8AoI-KikYosdluBsV8apy4ilAjedewtKdNLxWU7k/edit">https://docs.google.com/presentation/d/1icd8AoI-KikYosdluBsV8apy4ilAjedewtKdNLxWU7k/edit </a>
</p>

<p>
NUS Fintech Society Discord Server: <a href="https://docs.google.com/presentation/d/1CA8fSAVDATIwIHGAwpeyD5Zekpv6_eVVCFl5DkrbPog/edit#slide=id.gf46d8bbf32_0_978"> https://docs.google.com/presentation/d/1CA8fSAVDATIwIHGAwpeyD5Zekpv6_eVVCFl5DkrbPog/edit#slide=id.gf46d8bbf32_0_978 </a>
</p>

    <strong style="color:#0d5295">Warmest Regards\n</strong>
    <p style="color:#0d5295">NUS FinTech Society</p>
    `,
  })
}

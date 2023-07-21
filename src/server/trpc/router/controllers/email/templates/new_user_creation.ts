import { sendEmail } from '../email'
import { env } from '~/env/server.mjs'

function buildBody(password: string) {
  return `
    Dear User,
    <h2> Welcome to the NUS Fintech Society! </h2>
    <p> Here are a few items to take note of as you get started on your journey with us. </p>
    <h2>1. Collection of details (Compulsory)</h2>
    <p> 
        With effect from August 2023, we will be using the <a href="${env.NEXTAUTH_URL}">ATLAS HRMS</a> 
        portal to disseminate events and tasks. Before proceeding, please log into your account and 
        fill up the form. The password to the account will be ${password}. 
        You are <strong> strongly advised </strong> to change your password after your first login. 
    </p>
    <h2>2. Means of Communication</h2>
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
    <strong style="color:#0d5295">Warmest Regards\n</strong>
    <p style="color:#0d5295">NUS FinTech Society</p>
    `
}

export async function sendNewMemberEmail(recipient: string, password: string) {
  await sendEmail(recipient, 'Welcome to Fintech Society!', buildBody(password))
}

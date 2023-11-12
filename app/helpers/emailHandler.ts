import { environment, nodeMailer, websiteURls } from '../config/variables.config'
import { createTransport } from 'nodemailer'
import jwt from 'jsonwebtoken'

const transporter = createTransport({
  //@ts-ignore
  host: nodeMailer.host,
  port: nodeMailer.port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: nodeMailer.user, // generated ethereal user
    pass: nodeMailer.pass // generated ethereal password
  }
})

interface SendMail {
  receivingEmail: string
  useName: string
  accountId: string
}

export async function sendMailEmailVerification(props: SendMail) {
  // Create a unique verification ID using JWT
  const verifiedId = jwt.sign(
    { email: props.receivingEmail, accountId: props.accountId },
    nodeMailer.emailVerifiedSecretKey
  )

  const baseUrl = environment === 'development' ? websiteURls.dev : websiteURls.prod
  const redirectVerificationLink = `${baseUrl}/emailVerified?email=${props.receivingEmail}&id=${verifiedId}`

  const htmlContent = `
  <div style="border: 1px solid #ccc; padding: 20px; border-radius: 10px;">
  <h2>Email Verification - DeepBazar</h2>
  <p>Hello ${props.useName},</p>
  <p>Thank you for registering on DeepBazar. Please click the button below to verify your email:</p>
    <a href="${redirectVerificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
  </div>
`

  return transporter.sendMail({
    from: process.env.NODE_MAILER_EMAIL_SENDER_EMAIL,
    to: props.receivingEmail,
    subject: 'Email Verification for DeepBazar',
    text: htmlContent
  })
}

//-------------------------------------------
interface SendMailForgotPassword {
  receivingEmail: string
}

export async function sendMailForgotPassword(props: SendMailForgotPassword) {
  // Create a unique verification ID using JWT
  const verifiedId = jwt.sign({ email: props.receivingEmail }, nodeMailer.resetPasswordSecretKey, { expiresIn: '1h' })

  const baseUrl = environment === 'development' ? websiteURls.dev : websiteURls.prod
  const redirectVerificationLink = `${baseUrl}/auth/recover-password?email=${props.receivingEmail}&id=${verifiedId}`

  const htmlContent = `
    <div style="border: 1px solid #ccc; padding: 20px; border-radius: 10px;">
      <h2>Password Reset - DeepBazar</h2>
      <p>Hello,</p>
      <p>You have requested to reset your password on DeepBazar. End time is 1 hour from now. Please click the button below to proceed with the password reset:</p>
      <a href="${redirectVerificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
    </div>
  `

  return transporter.sendMail({
    from: process.env.NODE_MAILER_EMAIL_SENDER_EMAIL,
    to: props.receivingEmail,
    subject: 'Password Reset for DeepBazar',
    text: htmlContent
  })
}

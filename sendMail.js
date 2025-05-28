const nodemailer = require("nodemailer")

const sendForgotPasswordEmail = async (email, token) =>{

    const mailTransport = nodemailer.createTransport({
        //host: 'smtp.gmail.com', // or SendGrid, Mailgun, etc.
        //port: 587,
        //secure: false,
        service:"gmail",
        auth:{
            //service:"gmail",
            user: `${process.env.EMAIL}`,
            pass:`${process.env.EMAIL_PASSWORD}`
        }
    })

    const mailDetails = {
        from: `${process.env.EMAIL}`,
        to: `${email}`,
        subject: "Reset Password Notification",
        html: `
    <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
      <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
      <p style="color: #555; font-size: 16px;">
        You requested to reset your password. Please click the button below to continue:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://www.yourcareerex.com/reset-password/${token}" style="background-color: #007bff; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="color: #555; font-size: 14px;">
        If the button above does not work, please copy and paste the following URL into your browser:
      </p>
      <p style="word-break: break-all; color: #007bff; font-size: 14px;">
        https://www.yourcareerex.com/reset-password/${token}
      </p>
      <p style="margin-top: 20px; color: #555; font-size: 14px;">
        This link is valid for a limited time only and can be used once. If you did not request this, please ignore this message.
      </p>
      <hr style="margin: 30px 0;">
      <p style="font-size: 12px; color: #999; text-align: center;">
        &copy; ${new Date().getFullYear()} YourCareerEx. All rights reserved.
      </p>
    </div>`
        // html:`<h2> Here is the Token to reset your password, please click on this button,
        // <a clas="" href = 'https://www.yourcareerex.com/reset-password/${token}'>Reset Password</a> If the link did not work for any reason,
        // please click on the link below,
        //  <a clas="" href = 'https://www.yourcareerex.com/reset-password/${token}'>Reset Password</a>
         
        //  ${token}</h2>`
    }

    await mailTransport.sendMail(mailDetails)


}


const sendSignUpVerificationEmail = async (email, token) =>{

    const mailTransport2 = nodemailer.createTransport({
        //host: 'smtp.gmail.com', // or SendGrid, Mailgun, etc.
        //port: 587,
        //secure: false,
        service:"gmail",
        auth:{
            //service:"gmail",
            user: `${process.env.EMAIL}`,
            pass:`${process.env.EMAIL_PASSWORD}`
        }
    })

    const mailDetails2 = {
        from: `${process.env.EMAIL}`,
        to: `${email}`,
        subject: "Verify Email Notification",
        html: `<!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8" />
                        <title>Verify Your Email</title>
                    </head>
                    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                        <table width="100%" bgcolor="#f4f4f4" cellpadding="0" cellspacing="0" style="padding: 20px 0;">
                        <tr>
                            <td align="center">
                            <table width="600" bgcolor="#ffffff" cellpadding="20" cellspacing="0" style="border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                                <tr>
                                <td align="center" style="padding-bottom: 0;">
                                    <h2 style="color: #333;">Welcome to CareerEx!</h2>
                                </td>
                                </tr>
                                <tr>
                                <td style="font-size: 16px; color: #555;">
                                    <p>You're almost there! To complete your registration, please click the button below to verify your email and activate your account:</p>
                                </td>
                                </tr>
                                <tr>
                                <td align="center">
                                    <a href="https://www.yourcareerex.com/reset-password/${token}" 
                                    style="display: inline-block; padding: 12px 24px; color: #fff; background-color: #007bff; border-radius: 5px; text-decoration: none; font-weight: bold;">
                                    Verify Email
                                    </a>
                                </td>
                                </tr>
                                <tr>
                                <td style="font-size: 14px; color: #777; padding-top: 20px;">
                                    <p>If the button above doesn't work, copy and paste this link into your browser:</p>
                                    <p style="word-break: break-all;">
                                    <a href="https://www.yourcareerex.com/reset-password/${token}" style="color: #007bff;">
                                        https://www.yourcareerex.com/reset-password/${token}
                                    </a>
                                    </p>
                                    <p style="margin-top: 20px;">If you didn’t request this, you can safely ignore this email.</p>
                                </td>
                                </tr>
                                <tr>
                                <td align="center" style="font-size: 12px; color: #aaa; padding-top: 30px;">
                                    <p>© ${new Date().getFullYear()} CareerEx. All rights reserved.</p>
                                </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                        </table>
                    </body>
                    </html>`
    }

    await mailTransport2.sendMail(mailDetails2)


}

const validEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(email).toLowerCase())
}



module.exports = {
    sendForgotPasswordEmail,
    sendSignUpVerificationEmail,
    validEmail
}

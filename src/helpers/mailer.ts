import User from '@/models/userModels';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'

interface SendEmailParams {
  email: string;
  emailType: string; 
  userId: string;  
}

export const sendEmail  = async({email,emailType,userId}:SendEmailParams) =>
{
    try {
         //TODO: configure mail for usage
          const hashedToken = await bcryptjs.hash(userId.toString(),10)

         if(emailType === 'VERIFY'){

          await User.findByIdAndUpdate(userId,{verifyToken:hashedToken,verifyTokenExpiry:Date.now() + 3600000})


            }
            else if(emailType === "RESET"){
              await User.findByIdAndUpdate(userId,{forgotPasswordToken:hashedToken,forgotPasswordTokenExpiry:Date.now() + 3600000})

            }
          // Looking to send emails in production? Check out our Email API/SMTP product!
            const transporter = nodemailer.createTransport({
              host: "sandbox.smtp.mailtrap.io",
              port: 2525,
               auth: {
                user: "2415ffe238dd6c", //dont
                pass: "908bb46b290818"  //dont
               }
  
           });
          const mailOption ={
            from: 'saad@hossain.ai', 
            to: email, 
            subject: emailType==='verify'? 'Verify your email ' : 'Reset your password',
            html: `<p>Click <a href='${process.env.DOMAIN}/verifyemail?token=${hashedToken}'>here</a> to ${emailType === 'VERIFY' ? 'verify your email' :'reset your password'}
             or copy or paste the link below in your browser
             <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`, // html body
          }

          const mailResponse = await transporter.sendMail(mailOption)
          return mailResponse
    } 
    catch (error:unknown) {
      if(error instanceof Error){
        throw new Error(error.message)
      }
        
        
    }
}
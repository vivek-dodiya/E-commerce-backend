import nodeMailer from 'nodemailer'
import { ErrorHandler } from './errorHandler.js';

export const sendEmail = async (email, subject, message) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        service: process.env.SMTP_SERVICE,
        secure: false,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASS
        }
    });
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: subject,
        html: message
    }
    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        next(new ErrorHandler(400, error.message))
    }

}
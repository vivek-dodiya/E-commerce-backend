import { User } from '../../models/userModel.js';
import { catchAsyncErrors } from '../../utils/catchAsyncErrorHandler.js'
import { ErrorHandler } from '../../utils/errorHandler.js';
import { responseHandler } from '../../utils/responseHandler.js';
import { sendEmail } from '../../utils/sendMail.js';

export const userRegister = catchAsyncErrors(async (req, res, next) => {
    try {
        // check for input
        const { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password) {
            return next(new ErrorHandler(400, " All Field Require"))
        };

        //  check for validate phone number
        function validatePhoneNumber(phone) {
            const regex = /^(\+91[\s-]?)?[6-9]\d{9}$/;
            return regex.test(phone);
        }
        if (!validatePhoneNumber(phone)) {
            return next(new ErrorHandler(400, "Invalid Phone Number"))
        }

        // Check for user Exist 
        const isUserExist = await User.findOne({
            $or: [
                {
                    email,
                    accountVerified: true
                },
                {
                    phone,
                    accountVerified: true
                }
            ]
        });
        if (isUserExist) {
            return next(new ErrorHandler(400, "User Already Exist"))
        };

        //  Registratin Attempts By User 
        const registrationAttemptsByUser = await User.find({
            $or: [
                {
                    email,
                    accountVerified: false
                },
                {
                    phone,
                    accountVerified: false
                }
            ]
        });
        if (registrationAttemptsByUser.length > 2) {
            return next(new ErrorHandler(400, 'You Have Exceeded The Maximum Number Of Attempts Try After an Hour'))
        }


        //  creating user
        const user = await User.create({
            name,
            email,
            phone,
            password,
        });

        // save varification code
        const verificationCode = user.generateVerificationCode();
        await user.save();

        //  send verification code in email
        sendVerificationEmail(user, verificationCode);

        //  Send Response
        return next(new responseHandler(
            201,
            `Hello ${user.name} Your Account Created Success Fully Verification Code send to Your Email ${user.email}
            `,)
        );
    }
    catch (err) {
        return next(new ErrorHandler(400, err.message))
    }
});

async function sendVerificationEmail(user, verificationCode) {
    try {
        const message = emailTemplate(user, verificationCode);
        await sendEmail(user.email, "Verify Your Email", message);
    }
    catch (err) {
        return next(new ErrorHandler(400, err.message))
    }
};

function emailTemplate(user, verificationCode) {
    return `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 20px auto; padding: 0; border: 1px solid #ddd; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">🔑 Your Verification Code</h1>
            <p style="font-size: 16px; margin-top: 10px;">Secure your account in just a few steps</p>
        </div>
        <div style="padding: 25px;">
            <p style="font-size: 16px; color: #444;">Hello <strong>${user.name}</strong>,</p>
            <p style="font-size: 16px; color: #666; line-height: 1.6;">Thank you for signing up with us! Please use the following verification code to complete your registration:</p>
            <p style="font-size: 24px; font-weight: bold; color: #2575fc; text-align: center; border: 2px dashed #2575fc; padding: 15px; border-radius: 8px; background-color: #f3f7ff;">${verificationCode}</p>
            <p style="font-size: 16px; color: #666; line-height: 1.6;">This code is valid for <strong>5 minutes</strong>. If you didn’t request this code, please ignore this email. For any assistance, feel free to contact our support team.</p>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9; text-align: center; border-top: 1px solid #ddd;">
            <p style="font-size: 14px; color: #999;">If you have any questions, visit our <a href="#" style="color: #2575fc; text-decoration: none;">Help Center</a> or contact us at vivekdodiya1510@gmail.com.</p>
            <p style="font-size: 14px; color: #aaa;">© 2025 Your Company. All rights reserved.</p>
        </div>
    </div>
    `;
};
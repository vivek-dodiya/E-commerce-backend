import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        select: false
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 100,
    },
    role: {
        type: String,
        enum: ["owner", "user"],
        default: "user"
    },
    accountVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: Number
    },
    verificationCodeExpire: {
        type: Date
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
}, {
    timestamps: true
});

userSchema.pre("save",
    async function (next) {
        if (!this.isModified('password')) {
            return next();
        }
        this.password = await bcrypt.hash(this.password, 10)
        next()
    }
);

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
};

userSchema.methods.generateVerificationCode = function () {
    function generateRendomFiveDigitNumber() {
        const firstDigit = Math.floor(Math.random() * 9) + 1;
        const remainingDigit = Math.floor(Math.random() * 10000).toString().padStart(4, 0);
        return parseInt(firstDigit + remainingDigit)
    }
    this.verificationCode = generateRendomFiveDigitNumber();
    this.verificationCodeExpire = new Date(Date.now() + 5 * 60 * 1000);
    return this.verificationCode;
};


userSchema.methods.generateToken = async function ()  {
    return await jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE_IN })
}

export const User = mongoose.model("User", userSchema)
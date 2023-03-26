import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

//Password hash

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//Generate Token

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.SECRET_KEY, { expiresIn: process.env.EXPIRE })
}

// Compare Password

userSchema.methods.comparePassword = async function (enterPassword) {

    return await bcrypt.compare(enterPassword, this.password)

}

// Generate Reset Password Token 

userSchema.methods.getResetPasswordToken = function () {
    //Generate Token

    const resetToken = crypto.randomBytes(20).toString('hex');

    //Hashing and adding resetPasswordToken to userSchema

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken
}



const user = mongoose.model('user', userSchema);

export default user;
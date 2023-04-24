import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";


//Register User
const Register = async (req, res, next) => {
    try {
        if (!req.body.name || !req.body.email || !req.body.password) {
            return res.status(400).json({
                success: false,
                message: "Fill the required field"
            })
        }

        const userExist = await User.findOne({ email: req.body.email });

        if (userExist) {
            return res.status(400).json({
                success: false,
                message: "This Email Already Exist"
            })
        }

        const { name, email, password } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: "this is a sample image",
                url: "profileURL"
            }
        });

        const Token = await user.getJWTToken();

        const option = {
            expire: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        res.status(201).cookie("token", Token, option).json({
            success: true,
            Token,
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Enternal Server Error for register"
        })
    }
}

//Login User

const Login = async (req, res, next) => {

    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({
                success: false,
                message: "Please Enter Email and Password"
            })
        }

        const user = await User.findOne({ email: req.body.email }).select("+password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password"
            })
        }

        const isPasswordMatch = await user.comparePassword(req.body.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password"
            })
        }

        const Token = user.getJWTToken();

        const option = {
            expire: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        res.status(200).cookie("token", Token, option).json({
            success: true,
            Token,
            user
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Enternal Server Error."
        });
    }

}

//Logout User

const Logout = (req, res, next) => {

    try {
        res.cookie("token", "", {
            expire: new Date(Date.now()),
            httpOnly: true,
        })

        res.status(200).json({
            success: true,
            message: "Logout Successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Enternal Server Error."
        });
    }

}

//Forgot Password

const Forgot = async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }

    //Get resetPassword Token

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `http://localhost:8000/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, Please ignore it `;

    try {

        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return res.status(500).json(error.message)
    }
}

// Reset Password

const Reset = async (req, res, next) => {
    try {
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                message: "Reset Password Token is invalid or has been expired",
            })
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({
                message: "Please enter both password should be same"
            })
        }
        user.password = req.body.password;
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password Reset Successfully",
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Enternal Server Error."
        });
    }
}

// User Detail

const userDetail = async (req, res, next) => {

    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            message: "User detail",
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Enternal Server Error."
        });
    }


}

//Update Password

const updatePassword = async (req, res, next) => {

    try {
        const user = await User.findById(req.user.id).select("+password");

        const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Old Password is incorrect"
            })
        }

        if (req.body.newPassword !== req.body.confirmPassword) {
            return es.status(400).json({
                success: false,
                message: "password does not match"
            })
        }
        user.password = req.body.newPassword;

        await user.save();

        res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Enternal Server Error."
        });
    }

}

//Update Profile

const updateProfile = async (req, res, next) => {

    try {
        const newData = {
            name: req.body.name
        }
        await User.findByIdAndUpdate(req.user.id, newData, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });
        res.status(200).json({
            success: true,
            message: "Profile Update Successfully"
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Enternal Server Error."
        });
    }

}

//Get All Users -- Admin

const getAllUsers = async (req, res, next) => {

    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            users
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Enternal Server Error."
        });
    }
}

// Get SingleUser --Admin

const getSingleUser = async (req, res, next) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Enternal Server Error."
        });
    }
}

// Update User by Admin

const updateUser = async (req, res, next) => {

    try {
        const newData = {
            name: req.body.name,
            role: req.body.role
        }

        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not exist"
            })
        }

        user = await User.findByIdAndUpdate(req.params.id, newData, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        res.status(200).json({
            success: true
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Enternal Server Error."
        });
    }
}

// Delete User by Admin

const deleteUser = async (req, res, next) => {

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not exist"
            })
        }
        await user.remove();

        res.status(200).json({
            success: true,
            message: "User Deleted Successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Enternal Server Error."
        });
    }
}

export { Register, Login, Logout, Forgot, Reset, userDetail, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUser, deleteUser };
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";


const isAuthenticatedUser = async (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Please login to access this Resource"
        });
    }

    const decodedData = jwt.verify(token, process.env.SECRET_KEY);

    req.user = await User.findById(decodedData.id);

    next();
}

const authorizeRole = (...roles) => {

    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: true,
                message: `Role ${req.user.role} is not allowed to access this resorce`
            })
        }
        next();
    }
}

export { isAuthenticatedUser, authorizeRole };
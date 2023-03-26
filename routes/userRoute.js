import express from "express";
import { Register, Login, Logout, Forgot, Reset, userDetail, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUser, deleteUser } from "../controllers/userController.js";
import { isAuthenticatedUser, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

router.post('/register', Register);
router.post('/login', Login);
router.get('/logout', Logout);
router.post('/password/forgot', Forgot);
router.put('/password/reset/:token', Reset);
router.get('/userDetail', isAuthenticatedUser, userDetail);
router.put('/update/password', isAuthenticatedUser, updatePassword);
router.put('/update/profile', isAuthenticatedUser, updateProfile);
router.get('/admin/users', isAuthenticatedUser, authorizeRole("admin"), getAllUsers);
router.get('/admin/user/:id', isAuthenticatedUser, authorizeRole("admin"), getSingleUser);
router.put('/admin/updateUser/:id', isAuthenticatedUser, authorizeRole("admin"), updateUser);
router.delete('/admin/deleteUser/:id', isAuthenticatedUser, authorizeRole("admin"), deleteUser);


export default router;

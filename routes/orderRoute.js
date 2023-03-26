import express from "express";
import { createOrder, singleOrder, myOrder, getAllOrder, deleteOrder, updateOrder } from "../controllers/orderController.js";
import { isAuthenticatedUser, authorizeRole } from "../middleware/auth.js";



const router = express.Router();

router.post('/createOrder', isAuthenticatedUser, createOrder);
router.post('/singleOrder/:id', isAuthenticatedUser, singleOrder);
router.get('/myOrder', isAuthenticatedUser, myOrder);

router.get('/getAllOrder', isAuthenticatedUser, authorizeRole("admin"), getAllOrder);
router.delete('/deleteOrder/:id', isAuthenticatedUser, deleteOrder);
router.put('/updateOrderStatus/:id', isAuthenticatedUser, authorizeRole("admin"), updateOrder);




export default router;
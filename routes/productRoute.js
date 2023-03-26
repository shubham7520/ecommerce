import express from "express";
import { getproducts, createProduct, updateProduct, deleteProduct, productDetail, createProductReview, getAllReview, deleteReview } from "../controllers/productController.js";
import { isAuthenticatedUser, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

router.get('/getproducts', getproducts);
router.post('/admin/createProduct', isAuthenticatedUser, authorizeRole("admin"), createProduct);
router.put('/admin/updateProduct/:id', isAuthenticatedUser, authorizeRole("admin"), updateProduct);
router.delete('/admin/deleteProduct/:id', isAuthenticatedUser, authorizeRole("admin"), deleteProduct);
router.get('/productDetail/:id', productDetail);
router.post('/createReview', isAuthenticatedUser, createProductReview);
router.get('/getReviews', getAllReview);
router.delete('/deleteReview', isAuthenticatedUser, deleteReview);


export default router;
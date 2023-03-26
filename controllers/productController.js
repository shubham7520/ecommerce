import Product from "../models/productModel.js";
import ApiFeature from "../utils/apiFeatures.js";



//create product

const createProduct = async (req, res, next) => {
    try {
        if (!req.body.name || !req.body.description || !req.body.price || !req.body.category) {
            return res.status(400).json({
                success: false,
                message: "Name is required"
            })
        }

        req.body.user = req.user.id

        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Enternal Server Error"
        })
    }
}

// Get All Products

const getproducts = async (req, res) => {
    try {
        const resultPerPage = 5;
        const productCount = await Product.countDocuments();

        // const apiFeature = new ApiFeature(Product.find(), req.query).search().filter().pagination(resultPerPage);
        // const products = await apiFeature.query;

        const products = await Product.find();

        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Enternal Server Error"
        })
    }

}

// Get Product Detail

const productDetail = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(500).json({
                success: false,
                message: "Product not found"
            })
        }
        res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Enternal Server Error"
        })

    }

}

// Update Product By Id

const updateProduct = async (req, res, next) => {

    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(500).json({
                success: false,
                message: "Product not found"
            })
        }
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Enternal Server Error"
        })
    }

}

// Delete Product 

const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(500).json({
                success: false,
                message: "Product not found"
            })
        }
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Product Delete Successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Enternal Server Error"
        })
    }
}

// Create new review or Update riview

const createProductReview = async (req, res, next) => {
    try {
        const { rating, comment, productId } = req.body;

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        };

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }
        const isReviewed = product.reviews.find(
            (rev) => rev.user === req.user._id
        );

        if (isReviewed) {
            product.reviews.forEach(
                (rev) => {
                    if (rev.user === req.user._id) {
                        (rev.rating = rating), (rec.comment = comment);
                    }
                }
            );
        }
        else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }
        let avg = 0;
        product.reviews.forEach((rev) => {
            avg += rev.rating
        })
        product.rating = avg / product.reviews.length;

        await product.save({ validateBeforeSave: false })

        res.status(200).json({
            success: true
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Enternal Server Error"
        })
    }
}

//Get all review

const getAllReview = async (req, res, body) => {
    try {
        const product = await Product.findById(req.query.productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        res.status(200).json({
            success: true,
            reviews: product.reviews
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Enternal Server Error"
        })
    }
}

// Delete Review

const deleteReview = async (req, res, next) => {
    try {

        const product = await Product.findById(req.query.productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());
        let avg = 0;
        reviews.forEach((rev) => {
            avg += rev.rating;
        });
        console.log(reviews);

        const rating = avg / reviews.length;
        const numOfReviews = reviews.length;

        await Product.findByIdAndUpdate(req.query.productId, {
            reviews,
            numOfReviews,
            rating
        }, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });
        res.status(200).json({
            success: true
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Enternal Server Error"
        })
    }


}


export { getproducts, createProduct, updateProduct, deleteProduct, productDetail, createProductReview, getAllReview, deleteReview };
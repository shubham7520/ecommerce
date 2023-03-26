import order from "../models/orderModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

//Create Order

const createOrder = async (req, res, next) => {

    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, totalPrice, shippingPrice } = req.body;

    const order = await Order.create({
        shippingInfo,
        paymentInfo,
        orderItems,
        itemsPrice,
        taxPrice,
        totalPrice,
        shippingPrice,
        paidAt: Date.now(),
        user: req.user._id
    });

    res.status(201).json({
        success: true,
        order
    })
}

// Get Single Order

const singleOrder = async (req, res, next) => {

    const order = await Order.findById(req.params.id).populate(
        "User",
        "name email"

    );

    if (!order) {
        return res.status(404).json({
            success: true,
            message: "Order Not found"
        })
    }

    res.status(200).json({
        success: true,
        order
    })
}

// Check All order

const myOrder = async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders
    })
}

// Get All order --Admin

const getAllOrder = async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        orders,
        totalAmount
    })

}

// Delete Order

const deleteOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404).json({
            success: true,
            message: "Order not found"
        })
    }

    order.remove();
    res.status(200).json({
        success: true,
        message: "Order Delete Successfully."
    })
}

// Update Order --Admin

const updateOrder = async (req, res, next) => {

    const orders = await Order.findById(req.params.id);

    if (!orders) {
        res.status(404).json({
            success: true,
            message: "Order not found"
        })
    }

    if (orders.orderStatus === "Delivered") {
        return res.status(400).json({
            success: true,
            message: "You have already delivered this order"
        });
    }

    orders.orderItems.forEach(async (order) => {
        await updateStock(order.Product, order.quantity);
    });

    orders.orderStatus = req.body.status

    if (req.body.status === "Delivered") {
        orders.deliveredAt = Date.now();
    }

    await orders.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        message: "Order Status Updated",
        orders
    });
}

async function updateStock(id, quantity) {

    const product = await Product.findById(id);
    console.log(product);

    product.Stock = product.Stock - quantity;

    await product.save({ validateBeforeSave: false });
}

export { createOrder, singleOrder, myOrder, getAllOrder, deleteOrder, updateOrder };
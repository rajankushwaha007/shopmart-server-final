const mongoose = require("mongoose")

const CheckoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id Field is Mendatory"]
    },
    deliveryAddress: {
        type: Object,
        required: [true, "Delivery Address Field is Mendatory"]
    },
    orderStatus: {
        type: String,
        default: "Order Has Been Placed"
    },
    paymentMode: {
        type: String,
        default: "COD"
    },
    paymentStatus: {
        type: String,
        default: "Pending"
    },
    subtotal: {
        type: Number,
        required: [true, "Subtotal Amount Field is Mendatory"]
    },
    shipping: {
        type: Number,
        required: [true, "Shipping Amount Field is Mendatory"]
    },
    total: {
        type: Number,
        required: [true, "Total Amount Field is Mendatory"]
    },
    rppid: {
        type: String,
        default: ""
    },
    products: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "Product Id is Required"]
            },
            color: {
                type: String,
                required: [true, "Product Color is Required"]
            },
            size: {
                type: String,
                required: [true, "Product Size is Required"]
            },
            quantity: {
                type: Number,
                required: [true, "Product Quantity is Required"]
            },
            total: {
                type: Number,
                required: [true, "Product Total is Required"]
            }
        }],
        required: [true, "Carts Products are Required"],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'Please Provide Atleast One Cart Item'
        }
    }
}, { timestamps: true })
const Checkout = new mongoose.model("Checkout", CheckoutSchema)
module.exports = Checkout
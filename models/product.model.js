const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product Name Field is Mendatory"]
    },
    maincategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Maincategory",
        required: [true, "Maincategory Id Field is Mendatory"]
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
        required: [true, "Subcategory Id Field is Mendatory"]
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: [true, "Brand Id Field is Mendatory"]
    },
    color: {
        type: [String],
        required: [true, "Product Color is Required"],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'Please Provide Atleast One Product Color'
        }
    },
    size: {
        type: [String],
        required: [true, "Product Size is Required"],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'Please Provide Atleast One Product Size'
        }
    },
    basePrice: {
        type: Number,
        required: [true, "Product Base Price Field is Mendatory"]
    },
    discount: {
        type: Number,
        required: [true, "Discount on Product Field is Mendatory"]
    },
    finalPrice: {
        type: Number,
        required: [true, "Product Final Price Field is Mendatory"]
    },
    stock: {
        type: Boolean,
        default: true
    },
    stockQuantity: {
        type: Number,
        required: [true, "Product Stock Quantity Field is Mendatory"]
    },
    description: {
        type: String,
        default: ""
    },
    pic: {
        type: [String],
        required: [true, "Product Pic is Required"],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'Please Provide Atleast One Product Pic'
        }
    },
    status: {
        type: Boolean,
        default: true
    }
})
const Product = new mongoose.model("Product", ProductSchema)
module.exports = Product
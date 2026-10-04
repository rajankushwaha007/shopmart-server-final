const mongoose = require("mongoose")
require("dotenv").config()

const Product = require("../models/product.model")
const Subcategory = require("../models/subcategory.model")

const imageMap = {

    // Electronics
    "Laptops": "uploads/products/laptop.jpg",
    "Mobiles": "uploads/products/mobile.jpg",
    "Televisions": "uploads/products/laptop.jpg",
    "Headphones": "uploads/products/headphones.jpg",
    "Smart Watches": "uploads/products/smartwatch.jpg",
    "Cameras": "uploads/products/camera.jpg",
    "Power Banks": "uploads/products/mobile.jpg",

    // Fashion
    "T-Shirts": "uploads/products/tshirt.jpg",
    "Shirts": "uploads/products/shirt.jpg",
    "Jeans": "uploads/products/jeans.jpg",
    "Shoes": "uploads/products/shoes.jpg",
    "Sandals": "uploads/products/sandals.jpg",
    "Bags": "uploads/products/bag.jpg",

    // Home & Kitchen
    "Kitchen Appliances": "uploads/products/kitchen.jpg",
    "Furniture": "uploads/products/furniture.jpg",
    "Home Decor": "uploads/products/home-decor.jpg",

    // Sports
    "Cricket": "uploads/products/sports.jpg",
    "Football": "uploads/products/sports.jpg",
    "Badminton": "uploads/products/sports.jpg",
    "Fitness": "uploads/products/sports.jpg",
    "Sports Accessories": "uploads/products/sports.jpg"
}


async function updateImages() {

    try {

        console.log("Connecting to MongoDB...")

        await mongoose.connect(process.env.DB_KEY)

        console.log("MongoDB Connected Successfully")
        console.log("")
        console.log("Updating product images...")
        console.log("")

        let totalUpdated = 0

        for (const [subcategoryName, imagePath] of Object.entries(imageMap)) {

            const subcategory = await Subcategory.findOne({
                name: subcategoryName
            })

            if (!subcategory) {

                console.log(
                    `Subcategory not found: ${subcategoryName}`
                )

                continue
            }

            const result = await Product.updateMany(
                {
                    subcategory: subcategory._id
                },
                {
                    $set: {
                        pic: [imagePath]
                    }
                }
            )

            console.log(
                `${subcategoryName}: ${result.modifiedCount} products updated`
            )

            totalUpdated += result.modifiedCount
        }

        console.log("")
        console.log("--------------------------------")
        console.log("IMAGE UPDATE COMPLETED")
        console.log("--------------------------------")
        console.log(`Total Products Updated: ${totalUpdated}`)
        console.log("")
        console.log("MongoDB connection closed.")

        await mongoose.connection.close()

    } catch (error) {

        console.log("")
        console.log("ERROR:", error)

        await mongoose.connection.close()
    }
}


updateImages()
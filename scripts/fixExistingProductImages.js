const mongoose = require("mongoose")
require("dotenv").config()

const Product = require("../models/product.model")

const imageMap = {

    // Electronics
    laptop: "uploads/products/laptop.jpg",
    mobile: "uploads/products/mobile.jpg",
    smartphone: "uploads/products/mobile.jpg",
    television: "uploads/products/laptop.jpg",
    tv: "uploads/products/laptop.jpg",

    "power bank": "uploads/products/mobile.jpg",
    charger: "uploads/products/mobile.jpg",
    "mobile cover": "uploads/products/mobile.jpg",
    "usb cable": "uploads/products/mobile.jpg",
    "screen protector": "uploads/products/mobile.jpg",

    headphones: "uploads/products/headphones.jpg",
    earbuds: "uploads/products/headphones.jpg",
    earphones: "uploads/products/headphones.jpg",
    "gaming headset": "uploads/products/headphones.jpg",

    "smart watch": "uploads/products/smartwatch.jpg",
    smartwatch: "uploads/products/smartwatch.jpg",

    camera: "uploads/products/camera.jpg",

    mouse: "uploads/products/laptop.jpg",
    keyboard: "uploads/products/laptop.jpg",
    webcam: "uploads/products/laptop.jpg",
    "usb hub": "uploads/products/laptop.jpg",

    // Fashion
    "t-shirt": "uploads/products/tshirt.jpg",
    tshirt: "uploads/products/tshirt.jpg",

    shirt: "uploads/products/shirt.jpg",
    jeans: "uploads/products/jeans.jpg",

    shoes: "uploads/products/shoes.jpg",
    sandals: "uploads/products/sandals.jpg",

    bag: "uploads/products/bag.jpg",
    backpack: "uploads/products/bag.jpg",

    frock: "uploads/products/shirt.jpg",
    kurti: "uploads/products/shirt.jpg",
    saree: "uploads/products/shirt.jpg",
    "kids wear": "uploads/products/tshirt.jpg",

    // Home & Kitchen
    kitchen: "uploads/products/kitchen.jpg",
    cookware: "uploads/products/kitchen.jpg",
    storage: "uploads/products/kitchen.jpg",
    cleaning: "uploads/products/kitchen.jpg",
    "home decor": "uploads/products/home-decor.jpg",
    furniture: "uploads/products/furniture.jpg",

    // Sports
    cricket: "uploads/products/sports.jpg",
    football: "uploads/products/sports.jpg",
    badminton: "uploads/products/sports.jpg",
    fitness: "uploads/products/sports.jpg",
    sports: "uploads/products/sports.jpg",

    // Other categories - representative images
    toy: "uploads/products/sports.jpg",
    doll: "uploads/products/sports.jpg",
    puzzle: "uploads/products/sports.jpg",
    grocery: "uploads/products/kitchen.jpg",
    chocolate: "uploads/products/kitchen.jpg",
    snack: "uploads/products/kitchen.jpg",
    biscuit: "uploads/products/kitchen.jpg",
    beverage: "uploads/products/kitchen.jpg",
    shampoo: "uploads/products/home-decor.jpg",
    skincare: "uploads/products/home-decor.jpg",
    "face wash": "uploads/products/home-decor.jpg",
    book: "uploads/products/home-decor.jpg",
    stationery: "uploads/products/home-decor.jpg"
}


function getImage(productName) {

    const name = productName.toLowerCase()

    // More specific names first

    if (name.includes("laptop bag"))
        return imageMap.bag

    if (name.includes("power bank"))
        return imageMap["power bank"]

    if (
        name.includes("smart watch") ||
        name.includes("fitness smart watch") ||
        name.includes("bluetooth smart watch")
    )
        return imageMap["smart watch"]

    if (
        name.includes("wireless headphones") ||
        name.includes("bluetooth earbuds") ||
        name.includes("wired earphones") ||
        name.includes("gaming headset") ||
        name.includes("headphones") ||
        name.includes("earbuds") ||
        name.includes("earphones")
    )
        return imageMap.headphones

    if (
        name.includes("gaming laptop") ||
        name.includes("business laptop") ||
        name.includes("student laptop") ||
        name.includes("laptop")
    )
        return imageMap.laptop

    if (
        name.includes("smartphone") ||
        name.includes("5g smartphone") ||
        name.includes("android smartphone") ||
        name.includes("mobile")
    )
        return imageMap.mobile

    if (
        name.includes("smart tv") ||
        name.includes("led tv") ||
        name.includes("4k smart tv") ||
        name.includes("android tv") ||
        name.includes("television")
    )
        return imageMap.tv

    if (name.includes("camera"))
        return imageMap.camera

    if (
        name.includes("mouse") ||
        name.includes("keyboard") ||
        name.includes("webcam") ||
        name.includes("usb hub")
    )
        return imageMap.mouse

    if (
        name.includes("mobile cover") ||
        name.includes("fast charger") ||
        name.includes("usb cable") ||
        name.includes("screen protector")
    )
        return imageMap["mobile cover"]

    if (
        name.includes("t-shirt") ||
        name.includes("printed t-shirt") ||
        name.includes("oversized t-shirt") ||
        name.includes("polo t-shirt")
    )
        return imageMap["t-shirt"]

    if (
        name.includes("shirt") ||
        name.includes("formal shirt") ||
        name.includes("casual shirt") ||
        name.includes("printed shirt") ||
        name.includes("denim shirt")
    )
        return imageMap.shirt

    if (name.includes("jeans"))
        return imageMap.jeans

    if (
        name.includes("shoes") ||
        name.includes("running shoes") ||
        name.includes("sports shoes") ||
        name.includes("walking shoes")
    )
        return imageMap.shoes

    if (name.includes("sandals"))
        return imageMap.sandals

    if (
        name.includes("bag") ||
        name.includes("backpack") ||
        name.includes("school bag") ||
        name.includes("travel bag")
    )
        return imageMap.bag

    if (
        name.includes("frock") ||
        name.includes("kurti") ||
        name.includes("saree")
    )
        return imageMap.shirt

    if (name.includes("kids wear"))
        return imageMap.tshirt

    if (
        name.includes("kitchen") ||
        name.includes("cookware") ||
        name.includes("storage") ||
        name.includes("cleaning") ||
        name.includes("mixer") ||
        name.includes("kettle") ||
        name.includes("iron") ||
        name.includes("heater") ||
        name.includes("cooler")
    )
        return imageMap.kitchen

    if (name.includes("furniture"))
        return imageMap.furniture

    if (name.includes("home decor"))
        return imageMap["home decor"]

    if (
        name.includes("cricket") ||
        name.includes("football") ||
        name.includes("badminton") ||
        name.includes("fitness") ||
        name.includes("sports")
    )
        return imageMap.sports

    if (
        name.includes("toy") ||
        name.includes("doll") ||
        name.includes("action figure") ||
        name.includes("building blocks") ||
        name.includes("puzzle")
    )
        return imageMap.toy

    if (
        name.includes("chocolate") ||
        name.includes("snack") ||
        name.includes("biscuit") ||
        name.includes("beverage") ||
        name.includes("grocery") ||
        name.includes("dry fruits") ||
        name.includes("breakfast")
    )
        return imageMap.grocery

    if (
        name.includes("shampoo") ||
        name.includes("skin care") ||
        name.includes("skincare") ||
        name.includes("face wash") ||
        name.includes("body care") ||
        name.includes("grooming")
    )
        return imageMap.skincare

    if (
        name.includes("book") ||
        name.includes("programming") ||
        name.includes("story book") ||
        name.includes("stationery")
    )
        return imageMap.book

    // Final fallback
    return "uploads/products/home-decor.jpg"
}


async function fixExistingProductImages() {

    try {

        await mongoose.connect(process.env.DB_KEY)

        console.log("Database Connected")

        // Only target products generated by our import script
        const products = await Product.find({
            description: {
                $regex: "available at ShopMart"
            }
        })

        console.log(`Generated Products Found: ${products.length}`)

        if (products.length === 0) {

            console.log("No generated products found.")

            await mongoose.connection.close()

            return
        }

        const bulkOperations = []

        const imageCounts = {}

        for (const product of products) {

            const image = getImage(product.name)

            bulkOperations.push({

                updateOne: {

                    filter: {
                        _id: product._id
                    },

                    update: {
                        $set: {
                            pic: [image]
                        }
                    }

                }

            })

            imageCounts[image] = (imageCounts[image] || 0) + 1
        }


        if (bulkOperations.length > 0) {

            await Product.bulkWrite(
                bulkOperations,
                {
                    ordered: false
                }
            )

        }


        console.log("\nImage Update Completed!\n")

        console.log("Products Updated:", bulkOperations.length)

        console.log("\nImage Distribution:")

        Object.entries(imageCounts).forEach(([image, count]) => {

            console.log(`${image} : ${count}`)

        })


        await mongoose.connection.close()

        console.log("\nDatabase Connection Closed")

    }

    catch (error) {

        console.log("\nError:", error)

        await mongoose.connection.close()

    }

}


fixExistingProductImages()
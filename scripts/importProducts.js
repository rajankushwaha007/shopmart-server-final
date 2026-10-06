require("dotenv").config()

const mongoose = require("mongoose")
const fs = require("fs")
const path = require("path")

console.log("DB_KEY loaded:", !!process.env.DB_KEY)

const Product = require("../models/product.model")
const Maincategory = require("../models/maincategory.model")
const Subcategory = require("../models/subcategory.model")
const Brand = require("../models/brand.model")

const TARGET_PRODUCTS = 500


// DATA

const categories = {

    Electronics: [
        "Mobiles",
        "Laptops",
        "Televisions",
        "Mobile Accessories",
        "Computer Accessories",
        "Headphones",
        "Smart Watches",
        "Cameras",
        "Power Banks",
        "Home Appliances"
    ],

    Fashion: [
        "T-Shirts",
        "Shirts",
        "Jeans",
        "Frocks",
        "Kurtis",
        "Sarees",
        "Kids Wear",
        "Shoes",
        "Sandals",
        "Bags"
    ],

    "Home & Kitchen": [
        "Kitchen Appliances",
        "Cookware",
        "Storage",
        "Cleaning Products",
        "Home Decor",
        "Furniture",
        "Kitchen Tools"
    ],

    Toys: [
        "Remote Control Toys",
        "Dolls",
        "Action Figures",
        "Building Blocks",
        "Educational Toys",
        "Puzzles",
        "Outdoor Toys"
    ],

    Grocery: [
        "Chocolates",
        "Snacks",
        "Beverages",
        "Biscuits",
        "Dry Fruits",
        "Breakfast Foods",
        "Packaged Foods"
    ],

    "Beauty & Personal Care": [
        "Face Wash",
        "Shampoo",
        "Hair Care",
        "Skin Care",
        "Body Care",
        "Grooming"
    ],

    Sports: [
        "Cricket",
        "Football",
        "Badminton",
        "Fitness",
        "Sports Accessories"
    ],

    Books: [
        "Educational Books",
        "Story Books",
        "Programming Books",
        "Competitive Exam Books",
        "Stationery"
    ]
}


// BRANDS

const brands = {

    Electronics: [
        "Samsung",
        "Apple",
        "Xiaomi",
        "OnePlus",
        "Realme",
        "Motorola",
        "Sony",
        "LG",
        "HP",
        "Dell",
        "Lenovo",
        "Acer",
        "Asus",
        "Logitech",
        "Philips",
        "Portronics"
    ],

    Fashion: [
        "Puma",
        "Nike",
        "Adidas",
        "Levis",
        "Allen Solly",
        "Peter England",
        "Van Heusen",
        "Campus",
        "Roadster"
    ],

    "Home & Kitchen": [
        "Prestige",
        "Bajaj",
        "Havells",
        "Butterfly",
        "Milton",
        "Cello",
        "Wonderchef",
        "Pigeon"
    ],

    Toys: [
        "Funskool",
        "Hamleys",
        "Hot Wheels",
        "Lego",
        "Fisher Price"
    ],

    Grocery: [
        "Cadbury",
        "Nestle",
        "Britannia",
        "Parle",
        "Kelloggs",
        "Dairy Milk"
    ],

    "Beauty & Personal Care": [
        "Nivea",
        "Dove",
        "Lakme",
        "Ponds",
        "Garnier",
        "Himalaya",
        "Mamaearth"
    ],

    Sports: [
        "Cosco",
        "Yonex",
        "SG",
        "SS",
        "Nivia",
        "Adidas"
    ],

    Books: [
        "Penguin",
        "Oxford",
        "Arihant",
        "Oswaal",
        "McGraw Hill"
    ]
}

// ===============================
// PRODUCT TYPES

const productTypes = {

    "Mobiles": [
        "Smartphone",
        "5G Smartphone",
        "Android Smartphone",
        "Budget Smartphone"
    ],

    "Laptops": [
        "Laptop",
        "Gaming Laptop",
        "Business Laptop",
        "Student Laptop"
    ],

    "Televisions": [
        "Smart TV",
        "LED TV",
        "4K Smart TV",
        "Android TV"
    ],

    "Mobile Accessories": [
        "Mobile Cover",
        "Fast Charger",
        "USB Cable",
        "Screen Protector"
    ],

    "Computer Accessories": [
        "Wireless Mouse",
        "Keyboard",
        "Gaming Mouse",
        "Webcam",
        "USB Hub"
    ],

    "Headphones": [
        "Wireless Headphones",
        "Bluetooth Earbuds",
        "Wired Earphones",
        "Gaming Headset"
    ],

    "Smart Watches": [
        "Smart Watch",
        "Fitness Smart Watch",
        "Bluetooth Smart Watch"
    ],

    "Cameras": [
        "Digital Camera",
        "Action Camera",
        "Security Camera"
    ],

    "Power Banks": [
        "Power Bank",
        "Fast Charging Power Bank"
    ],

    "Home Appliances": [
        "Electric Kettle",
        "Mixer Grinder",
        "Iron",
        "Room Heater",
        "Air Cooler"
    ],

    "T-Shirts": [
        "Cotton T-Shirt",
        "Printed T-Shirt",
        "Oversized T-Shirt",
        "Polo T-Shirt"
    ],

    "Shirts": [
        "Casual Shirt",
        "Formal Shirt",
        "Printed Shirt",
        "Denim Shirt"
    ],

    "Jeans": [
        "Slim Fit Jeans",
        "Regular Fit Jeans",
        "Straight Fit Jeans"
    ],

    "Frocks": [
        "Girls Frock",
        "Party Wear Frock",
        "Cotton Frock",
        "Printed Frock"
    ],

    "Kurtis": [
        "Cotton Kurti",
        "Printed Kurti",
        "Anarkali Kurti"
    ],

    "Sarees": [
        "Cotton Saree",
        "Silk Saree",
        "Printed Saree"
    ],

    "Kids Wear": [
        "Kids T-Shirt",
        "Kids Dress",
        "Kids Shorts",
        "Kids Jacket"
    ],

    "Shoes": [
        "Running Shoes",
        "Casual Shoes",
        "Sports Shoes",
        "Walking Shoes"
    ],

    "Sandals": [
        "Casual Sandals",
        "Kids Sandals",
        "Comfort Sandals"
    ],

    "Bags": [
        "Backpack",
        "Laptop Bag",
        "School Bag",
        "Travel Bag"
    ],

    "Kitchen Appliances": [
        "Mixer Grinder",
        "Electric Kettle",
        "Toaster",
        "Rice Cooker"
    ],

    "Cookware": [
        "Non Stick Pan",
        "Pressure Cooker",
        "Frying Pan",
        "Cookware Set"
    ],

    "Storage": [
        "Storage Box",
        "Food Container",
        "Plastic Container",
        "Storage Basket"
    ],

    "Cleaning Products": [
        "Floor Cleaner",
        "Cleaning Brush",
        "Mop",
        "Dustbin"
    ],

    "Home Decor": [
        "Wall Clock",
        "Table Lamp",
        "Decorative Vase",
        "LED Light"
    ],

    "Furniture": [
        "Office Chair",
        "Study Table",
        "Computer Table",
        "Bookshelf"
    ],

    "Kitchen Tools": [
        "Knife Set",
        "Peeler",
        "Chopping Board",
        "Kitchen Tool Set"
    ],

    "Remote Control Toys": [
        "Remote Control Car",
        "Remote Control Helicopter",
        "Remote Control Truck"
    ],

    "Dolls": [
        "Fashion Doll",
        "Baby Doll",
        "Doll Set"
    ],

    "Action Figures": [
        "Superhero Action Figure",
        "Robot Action Figure",
        "Character Toy"
    ],

    "Building Blocks": [
        "Building Blocks Set",
        "Creative Blocks",
        "Construction Blocks"
    ],

    "Educational Toys": [
        "Learning Toy",
        "Alphabet Learning Toy",
        "Math Learning Toy"
    ],

    "Puzzles": [
        "Jigsaw Puzzle",
        "Kids Puzzle",
        "Educational Puzzle"
    ],

    "Outdoor Toys": [
        "Toy Football",
        "Outdoor Play Set",
        "Toy Car"
    ],

    "Chocolates": [
        "Milk Chocolate",
        "Dark Chocolate",
        "Chocolate Bar",
        "Chocolate Gift Pack"
    ],

    "Snacks": [
        "Potato Chips",
        "Namkeen",
        "Snack Pack"
    ],

    "Beverages": [
        "Fruit Juice",
        "Energy Drink",
        "Soft Drink"
    ],

    "Biscuits": [
        "Cream Biscuits",
        "Chocolate Biscuits",
        "Butter Biscuits"
    ],

    "Dry Fruits": [
        "Almonds",
        "Cashews",
        "Mixed Dry Fruits"
    ],

    "Breakfast Foods": [
        "Corn Flakes",
        "Oats",
        "Muesli"
    ],

    "Packaged Foods": [
        "Instant Noodles",
        "Pasta",
        "Ready To Eat Food"
    ],

    "Face Wash": [
        "Face Wash",
        "Deep Cleansing Face Wash",
        "Oil Control Face Wash"
    ],

    "Shampoo": [
        "Hair Shampoo",
        "Anti Dandruff Shampoo",
        "Hair Care Shampoo"
    ],

    "Hair Care": [
        "Hair Oil",
        "Hair Serum",
        "Hair Conditioner"
    ],

    "Skin Care": [
        "Moisturizer",
        "Face Cream",
        "Skin Lotion"
    ],

    "Body Care": [
        "Body Lotion",
        "Body Wash",
        "Soap"
    ],

    "Grooming": [
        "Trimmer",
        "Shaver",
        "Grooming Kit"
    ],

    "Cricket": [
        "Cricket Bat",
        "Cricket Ball",
        "Cricket Gloves",
        "Cricket Kit"
    ],

    "Football": [
        "Football",
        "Football Shoes",
        "Goalkeeper Gloves"
    ],

    "Badminton": [
        "Badminton Racket",
        "Shuttlecock",
        "Badminton Kit"
    ],

    "Fitness": [
        "Yoga Mat",
        "Dumbbell",
        "Resistance Band",
        "Skipping Rope"
    ],

    "Sports Accessories": [
        "Sports Bottle",
        "Gym Gloves",
        "Sports Bag"
    ],

    "Educational Books": [
        "Mathematics Book",
        "Science Book",
        "Computer Book"
    ],

    "Story Books": [
        "Children Story Book",
        "Moral Story Book",
        "Adventure Story Book"
    ],

    "Programming Books": [
        "JavaScript Programming Book",
        "React Programming Book",
        "Node.js Programming Book"
    ],

    "Competitive Exam Books": [
        "Aptitude Book",
        "Reasoning Book",
        "General Knowledge Book"
    ],

    "Stationery": [
        "Notebook",
        "Pen Set",
        "Pencil Set",
        "School Stationery Set"
    ]
}


// COLORS

const colors = [
    "Black",
    "White",
    "Blue",
    "Red",
    "Green",
    "Grey",
    "Yellow"
]


// PRODUCT IMAGE FOLDER

const productImageFolder = path.join(
    __dirname,
    "../public/uploads/products/generated"
)

if (!fs.existsSync(productImageFolder)) {
    throw new Error(
        "Product image folder not found: " + productImageFolder
    )
}


// GET ALL PRODUCT IMAGES

const productImages = fs
    .readdirSync(productImageFolder)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .sort()
    .map(file => `uploads/products/generated/${file}`)

if (productImages.length === 0) {
    throw new Error(
        "No product images found inside public/uploads/products"
    )
}

console.log(
    `Available product images: ${productImages.length}`
)


// SIZES

const clothingSizes = [
    "S",
    "M",
    "L",
    "XL"
]


// HELPER FUNCTIONS

function randomItem(array) {
    return array[
        Math.floor(Math.random() * array.length)
    ]
}

function randomNumber(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min
}


function getPrice(category) {

    if (category === "Electronics") {
        return randomNumber(500, 90000)
    }

    if (category === "Fashion") {
        return randomNumber(300, 6000)
    }

    if (category === "Toys") {
        return randomNumber(200, 4000)
    }

    if (category === "Grocery") {
        return randomNumber(50, 1500)
    }

    if (category === "Sports") {
        return randomNumber(200, 5000)
    }

    if (category === "Books") {
        return randomNumber(150, 2500)
    }

    if (category === "Beauty & Personal Care") {
        return randomNumber(100, 2500)
    }

    return randomNumber(200, 10000)
}


function createProductName(type, brand, index) {
    return `${brand} ${type} ${index}`
}


// MAIN IMPORT FUNCTION

async function importProducts() {

    try {

        // CONNECT MONGODB
        await mongoose.connect(process.env.DB_KEY)

        console.log(
            "MongoDB Connected Successfully\n"
        )
        // DELETE ALL OLD PRODUCTS
        await Product.deleteMany({})

        console.log(
            "Old products deleted successfully.\n"
        )
        console.log(
            "Starting fresh product generation...\n"
        )
        // CACHE
        const categoryMap = {}
        const subcategoryMap = {}
        const brandMap = {}
        // MAIN CATEGORIES

        for (
            const categoryName of Object.keys(categories)
        ) {
            let category =
                await Maincategory.findOne({
                    name: categoryName
                })
            if (!category) {

                category =
                    await Maincategory.create({

                        name: categoryName,

                        pic: getRandomProductImage(),

                        status: true
                    })
                console.log(
                    `Created Maincategory: ${categoryName}`
                )
            }
            categoryMap[categoryName] =
                category._id
        }
        // SUBCATEGORIES
        for (
            const categoryName of Object.keys(categories)
        ) {

            for (
                const subcategoryName
                of categories[categoryName]
            ) {

                let subcategory =
                    await Subcategory.findOne({
                        name: subcategoryName
                    })
                if (!subcategory) {

                    subcategory =
                        await Subcategory.create({

                            name: subcategoryName,

                            pic: getRandomProductImage(),

                            status: true
                        })
                    console.log(
                        `Created Subcategory: ${subcategoryName}`
                    )
                }
                subcategoryMap[subcategoryName] =
                    subcategory._id
            }
        }
        // BRANDS
        for (
            const categoryName of Object.keys(brands)
        ) {

            for (
                const brandName
                of brands[categoryName]
            ) {

                let brand =
                    await Brand.findOne({
                        name: brandName
                    })
                if (!brand) {

                    brand =
                        await Brand.create({

                            name: brandName,

                            pic: getRandomProductImage(),

                            status: true
                        })
                    console.log(
                        `Created Brand: ${brandName}`
                    )
                }
                brandMap[brandName] =
                    brand._id
            }
        }
        // GENERATE PRODUCTS

        const products = []

        let counter = 1

        const existingNames = new Set()
        if (productImages.length < TARGET_PRODUCTS) {
            throw new Error(
                `Only ${productImages.length} product images found. Required: ${TARGET_PRODUCTS}`
            )
        }
        while (
            products.length < TARGET_PRODUCTS
        ) {
            // RANDOM CATEGORY
            const categoryName =
                randomItem(
                    Object.keys(categories)
                )
            // RANDOM SUBCATEGORY
            const subcategoryName =
                randomItem(
                    categories[categoryName]
                )
            // PRODUCT TYPE LIST
            const typeList =
                productTypes[subcategoryName]

            if (!typeList) {
                continue
            }
            // RANDOM PRODUCT TYPE
            const type =
                randomItem(typeList)

            // RANDOM BRAND
            const brandList =
                brands[categoryName]
            const brandName =
                randomItem(brandList)
            // PRODUCT NAME
            const productName =
                createProductName(
                    type,
                    brandName,
                    counter
                )
            counter++
            // DUPLICATE CHECK
            if (
                existingNames.has(productName)
            ) {
                continue
            }
            existingNames.add(productName)
            // PRICE
            const basePrice =
                getPrice(categoryName)


            const discount =
                randomNumber(5, 40)


            const finalPrice =
                Math.round(
                    basePrice -
                    (
                        basePrice *
                        discount /
                        100
                    )
                )
            // SIZE
            let sizes = ["N/A"]
            if (
                categoryName === "Fashion"
            ) {
                sizes = clothingSizes
            }
            // PRODUCT
            const product = {

                name: productName,

                maincategory:
                    categoryMap[categoryName],

                subcategory:
                    subcategoryMap[subcategoryName],

                brand:
                    brandMap[brandName],

                color: [
                    randomItem(colors),
                    randomItem(colors)
                ],

                size: sizes,

                basePrice: basePrice,

                discount: discount,

                finalPrice: finalPrice,

                stock: true,

                stockQuantity:
                    randomNumber(5, 100),

                description:
                    `${productName} available at ShopMart. Quality product with attractive pricing and reliable performance.`,

                pic: [
                    productImages[products.length]
                ],

                status: true
            }
            products.push(product)
            // PROGRESS
            if (
                products.length % 100 === 0
            ) {

                console.log(
                    `Prepared ${products.length} products...`
                )
            }
        }
        // INSERT PRODUCTS
        console.log(
            `\nInserting ${products.length} products...\n`
        )
        const insertedProducts =
            await Product.insertMany(products)

        console.log(
            `Successfully Inserted: ${insertedProducts.length}`
        )
        // FINAL COUNT
        const totalProducts =
            await Product.countDocuments()


        console.log(
            `Total Products Now: ${totalProducts}`
        )

        console.log(
            "\nProduct import completed successfully! 🎉\n"
        )

    }

    catch (error) {

        console.error(
            "\nProduct Import Error:"
        )

        console.error(
            error
        )

    }

    finally {

        await mongoose.connection.close()

        console.log(
            "MongoDB connection closed."
        )
    }
}
// RUN
importProducts()
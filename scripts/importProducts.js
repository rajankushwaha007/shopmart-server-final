// const mongoose = require("mongoose")
// require("dotenv").config()
require("dotenv").config()

const mongoose = require("mongoose")

console.log("DB_KEY loaded:", !!process.env.DB_KEY)

const Product = require("../models/product.model")
const Maincategory = require("../models/maincategory.model")
const Subcategory = require("../models/subcategory.model")
const Brand = require("../models/brand.model")

const TARGET_PRODUCTS = 2000


// --------------------------------------------------
// DATA
// --------------------------------------------------

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


// --------------------------------------------------
// BRANDS
// --------------------------------------------------

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


// --------------------------------------------------
// PRODUCT TYPES
// --------------------------------------------------

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
        "Toy Gun",
        "Toy Football",
        "Outdoor Play Set"
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


// --------------------------------------------------
// COLORS & SIZES
// --------------------------------------------------

const colors = [
    "Black",
    "White",
    "Blue",
    "Red",
    "Green",
    "Grey",
    "Yellow"
]
const imageMap = {

    "Laptops": "uploads/products/laptop.jpg",
    "Mobiles": "uploads/products/mobile.jpg",
    "Televisions": "uploads/products/laptop.jpg",

    "T-Shirts": "uploads/products/tshirt.jpg",
    "Shirts": "uploads/products/shirt.jpg",
    "Jeans": "uploads/products/jeans.jpg",
    "Shoes": "uploads/products/shoes.jpg",
    "Sandals": "uploads/products/sandals.jpg",
    "Bags": "uploads/products/bag.jpg",

    "Headphones": "uploads/products/headphones.jpg",
    "Smart Watches": "uploads/products/smartwatch.jpg",
    "Cameras": "uploads/products/camera.jpg",
    "Power Banks": "uploads/products/mobile.jpg",

    "Kitchen Appliances": "uploads/products/kitchen.jpg",
    "Furniture": "uploads/products/furniture.jpg",
    "Home Decor": "uploads/products/home-decor.jpg",

    "Cricket": "uploads/products/sports.jpg",
    "Football": "uploads/products/sports.jpg",
    "Badminton": "uploads/products/sports.jpg",
    "Fitness": "uploads/products/sports.jpg",
    "Sports Accessories": "uploads/products/sports.jpg"
}
const clothingSizes = [
    "S",
    "M",
    "L",
    "XL"
]


// --------------------------------------------------
// HELPER FUNCTIONS
// --------------------------------------------------

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)]
}


function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
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


// --------------------------------------------------
// MAIN IMPORT FUNCTION
// --------------------------------------------------

async function importProducts() {

    try {

        console.log("\nConnecting to MongoDB...\n")

        await mongoose.connect(process.env.DB_KEY)

        console.log("MongoDB Connected Successfully\n")


        // --------------------------------------------------
        // GET EXISTING PRODUCT IMAGE
        // --------------------------------------------------

        const existingProduct = await Product.findOne({
            pic: {
                $exists: true,
                $ne: []
            }
        }).lean()


        if (!existingProduct || !existingProduct.pic?.length) {

            throw new Error(
                "No existing product image found. Please add at least one product first."
            )

        }


        const defaultPic = existingProduct.pic[0]


        console.log("Using existing product image:")
        console.log(defaultPic)
        console.log("")


        // --------------------------------------------------
        // EXISTING PRODUCT NAMES
        // --------------------------------------------------

        const existingProducts = await Product.find(
            {},
            {
                name: 1
            }
        ).lean()


        const existingNames = new Set(
            existingProducts.map(product => product.name)
        )


        console.log(
            `Existing Products: ${existingProducts.length}`
        )


        // --------------------------------------------------
        // CATEGORY CACHE
        // --------------------------------------------------

        const categoryMap = {}
        const subcategoryMap = {}
        const brandMap = {}


        // --------------------------------------------------
        // CREATE / GET MAIN CATEGORIES
        // --------------------------------------------------

        for (const categoryName of Object.keys(categories)) {

            let category = await Maincategory.findOne({
                name: categoryName
            })


            if (!category) {

                category = await Maincategory.create({
                    name: categoryName,
                    pic: defaultPic,
                    status: true
                })

                console.log(
                    `Created Maincategory: ${categoryName}`
                )
            }


            categoryMap[categoryName] = category._id
        }


        // --------------------------------------------------
        // CREATE / GET SUBCATEGORIES
        // --------------------------------------------------

        for (const categoryName of Object.keys(categories)) {

            for (const subcategoryName of categories[categoryName]) {

                let subcategory = await Subcategory.findOne({
                    name: subcategoryName
                })


                if (!subcategory) {

                    subcategory = await Subcategory.create({
                        name: subcategoryName,
                        pic: defaultPic,
                        status: true
                    })

                    console.log(
                        `Created Subcategory: ${subcategoryName}`
                    )
                }


                subcategoryMap[subcategoryName] = subcategory._id
            }
        }


        // --------------------------------------------------
        // CREATE / GET BRANDS
        // --------------------------------------------------

        for (const categoryName of Object.keys(brands)) {

            for (const brandName of brands[categoryName]) {

                let brand = await Brand.findOne({
                    name: brandName
                })


                if (!brand) {

                    brand = await Brand.create({
                        name: brandName,
                        pic: defaultPic,
                        status: true
                    })

                    console.log(
                        `Created Brand: ${brandName}`
                    )
                }


                brandMap[brandName] = brand._id
            }
        }


        // --------------------------------------------------
        // GENERATE PRODUCTS
        // --------------------------------------------------

        const products = []

        let counter = 1


        while (products.length < TARGET_PRODUCTS) {

            const categoryName = randomItem(
                Object.keys(categories)
            )


            const subcategoryName = randomItem(
                categories[categoryName]
            )


            const typeList = productTypes[subcategoryName]


            if (!typeList) {
                continue
            }


            const type = randomItem(typeList)


            const brandList = brands[categoryName]


            const brandName = randomItem(brandList)


            const productName = createProductName(
                type,
                brandName,
                counter
            )


            counter++


            // Avoid duplicate product names
            if (existingNames.has(productName)) {
                continue
            }


            existingNames.add(productName)


            // --------------------------------------------------
            // PRICE
            // --------------------------------------------------

            const basePrice = getPrice(categoryName)

            const discount = randomNumber(5, 40)

            const finalPrice = Math.round(
                basePrice - (basePrice * discount / 100)
            )


            // --------------------------------------------------
            // SIZE
            // --------------------------------------------------

            let sizes = ["N/A"]

            if (
                categoryName === "Fashion" ||
                categoryName === "Sports"
            ) {
                sizes = clothingSizes
            }


            // --------------------------------------------------
            // PRODUCT
            // --------------------------------------------------

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

                basePrice,

                discount,

                finalPrice,

                stock: true,

                stockQuantity: randomNumber(5, 100),

                description:
                    `${productName} available at ShopMart. Quality product with attractive pricing and reliable performance.`,

                pic: [
                    imageMap[subcategoryName] || defaultPic
                ],

                status: true
            }


            products.push(product)


            if (products.length % 100 === 0) {

                console.log(
                    `Prepared ${products.length} products...`
                )
            }
        }


        // --------------------------------------------------
        // INSERT
        // --------------------------------------------------

        console.log(
            `\nInserting ${products.length} products...\n`
        )


        const insertedProducts =
            await Product.insertMany(products)


        console.log(
            `Successfully Inserted: ${insertedProducts.length}`
        )


        // --------------------------------------------------
        // FINAL COUNT
        // --------------------------------------------------

        const totalProducts =
            await Product.countDocuments()


        console.log(
            `Total Products Now: ${totalProducts}`
        )


        console.log("\nProduct import completed successfully! 🎉\n")


    } catch (error) {

        console.error(
            "\nProduct Import Error:"
        )

        console.error(error.message)

    } finally {

        await mongoose.connection.close()

        console.log(
            "MongoDB connection closed."
        )
    }
}


// --------------------------------------------------
// RUN
// --------------------------------------------------

importProducts()
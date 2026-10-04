const { GoogleGenAI } = require("@google/genai")
const Product = require("../models/product.model")
const Maincategory = require("../models/maincategory.model")
const Subcategory = require("../models/subcategory.model")
const Brand = require("../models/brand.model")

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})


// --------------------------------------------------
// ESCAPE REGEX
// --------------------------------------------------

function escapeRegex(text) {

    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

}


// --------------------------------------------------
// SINGULAR KEYWORD
// --------------------------------------------------

function normalizeKeyword(word) {

    word = word.toLowerCase().trim()

    if (word.endsWith("ies") && word.length > 4) {
        return word.slice(0, -3) + "y"
    }

    if (word.endsWith("s") && word.length > 3) {
        return word.slice(0, -1)
    }

    return word
}


// --------------------------------------------------
// EXTRACT PRICE FILTER
// --------------------------------------------------

function extractPriceFilter(question) {

    const text = question
        .toLowerCase()
        .replace(/,/g, "")
        .replace(/₹/g, "")
        .replace(/rs\.?/g, "")
        .replace(/rupees?/g, "")

    let filter = {}

    // Between 1000 and 5000
    const betweenMatch = text.match(
        /between\s+(\d+)\s+(?:and|to)\s+(\d+)/
    )

    if (betweenMatch) {

        filter.finalPrice = {
            $gte: Number(betweenMatch[1]),
            $lte: Number(betweenMatch[2])
        }

        return filter
    }


    // Under / below / less than / up to
    const maxMatch = text.match(
        /(?:under|below|less than|up to|max(?:imum)?)\s+(\d+)/
    )

    if (maxMatch) {

        filter.finalPrice = {
            $lte: Number(maxMatch[1])
        }

        return filter
    }


    // Above / over / more than
    const minMatch = text.match(
        /(?:above|over|more than|greater than|starting from)\s+(\d+)/
    )

    if (minMatch) {

        filter.finalPrice = {
            $gte: Number(minMatch[1])
        }

        return filter
    }


    return filter
}


// --------------------------------------------------
// EXTRACT KEYWORDS
// --------------------------------------------------

function extractKeywords(question) {

    let text = question
        .toLowerCase()
        .replace(/₹/g, " ")
        .replace(/rs\.?/g, " ")
        .replace(/rupees?/g, " ")
        .replace(/,/g, " ")
        .replace(/[?!.,]/g, " ")


    // Remove price phrases
    text = text.replace(
        /(?:under|below|less than|up to|max(?:imum)?|above|over|more than|greater than|starting from|between)\s+\d+/g,
        " "
    )


    const stopWords = [

        "show",
        "me",
        "find",
        "give",
        "get",
        "want",
        "need",
        "looking",
        "for",

        "product",
        "products",

        "available",
        "availability",

        "please",
        "can",
        "you",
        "could",
        "would",

        "the",
        "a",
        "an",
        "is",
        "are",

        "in",
        "on",
        "at",
        "from",
        "to",
        "with",

        "and",
        "or",

        "under",
        "below",
        "above",
        "over",
        "less",
        "more",
        "than",

        "price",
        "prices",

        "between",

        "my",
        "your",

        "i"
    ]


    const words = text
        .split(/\s+/)
        .map(word => word.trim())
        .filter(word => word.length > 1)
        .filter(word => !stopWords.includes(word))
        .filter(word => !/^\d+$/.test(word))


    const keywords = words.map(normalizeKeyword)

    return [...new Set(keywords)]
}


// --------------------------------------------------
// GEMINI RESPONSE
// --------------------------------------------------

async function generateAIResponse(prompt) {

    const models = [
        "gemini-3.8-flash",
        "gemini-3.7-flash",
        "gemini-3.6-flash",
        "gemini-3.5-flash"
    ]


    for (const model of models) {

        try {

            console.log(`Trying Gemini model: ${model}`)

            const response = await ai.models.generateContent({
                model: model,
                contents: prompt
            })

            console.log(`Gemini model worked: ${model}`)

            return response

        } catch (error) {

            console.log(
                `${model} failed:`,
                error.status || error.message
            )
        }
    }


    throw new Error(
        "All Gemini AI models are currently unavailable."
    )
}


// --------------------------------------------------
// ASK AI
// --------------------------------------------------

const askAI = async (req, res) => {

    try {

        const { question } = req.body


        if (!question) {

            return res.status(400).json({
                success: false,
                message: "Question is required"
            })
        }


        console.log("Customer Question:", question)


        // --------------------------------------------------
        // EXTRACT KEYWORDS
        // --------------------------------------------------

        const keywords = extractKeywords(question)

        console.log("AI Keywords:", keywords)


        // --------------------------------------------------
        // PRICE FILTER
        // --------------------------------------------------

        const priceFilter = extractPriceFilter(question)

        console.log("AI Price Filter:", priceFilter)


        // --------------------------------------------------
        // FIND CATEGORY / SUBCATEGORY / BRAND IDs
        // --------------------------------------------------

        const keywordConditions = []


        for (const keyword of keywords) {

            const regex = new RegExp(
                escapeRegex(keyword) + "s?",
                "i"
            )


            const categoryMatches =
                await Maincategory.find({
                    name: regex,
                    status: true
                })
                    .select("_id")
                    .lean()


            const subcategoryMatches =
                await Subcategory.find({
                    name: regex,
                    status: true
                })
                    .select("_id")
                    .lean()


            const brandMatches =
                await Brand.find({
                    name: regex,
                    status: true
                })
                    .select("_id")
                    .lean()


            const categoryIds =
                categoryMatches.map(item => item._id)


            const subcategoryIds =
                subcategoryMatches.map(item => item._id)


            const brandIds =
                brandMatches.map(item => item._id)


            const condition = {

                $or: [

                    {
                        name: regex
                    },

                    {
                        description: regex
                    },

                    {
                        color: regex
                    },

                    {
                        size: regex
                    }

                ]

            }


            if (categoryIds.length > 0) {

                condition.$or.push({
                    maincategory: {
                        $in: categoryIds
                    }
                })

            }


            if (subcategoryIds.length > 0) {

                condition.$or.push({
                    subcategory: {
                        $in: subcategoryIds
                    }
                })

            }


            if (brandIds.length > 0) {

                condition.$or.push({
                    brand: {
                        $in: brandIds
                    }
                })

            }


            keywordConditions.push(condition)
        }


        // --------------------------------------------------
        // MONGODB FILTER
        // --------------------------------------------------

        const mongoFilter = {

            status: true,

            ...priceFilter

        }


        // All meaningful keywords must match
        if (keywordConditions.length > 0) {

            mongoFilter.$and = keywordConditions

        }


        // --------------------------------------------------
        // FIND PRODUCTS
        // --------------------------------------------------

        const products = await Product.find(mongoFilter)

            .populate("maincategory", "name")

            .populate("subcategory", "name")

            .populate("brand", "name")

            .limit(30)

            .lean()


        console.log(
            `AI Candidate Products: ${products.length}`
        )


        // --------------------------------------------------
        // NO PRODUCTS FOUND
        // --------------------------------------------------

        if (products.length === 0) {

            return res.status(200).json({

                success: true,

                message:
                    "No matching products found",

                answer:
                    "Sorry, I couldn't find any products matching your request.",

                products: []

            })
        }


        // --------------------------------------------------
        // PRODUCT DATA FOR GEMINI
        // --------------------------------------------------

        const productData = products.map(product => ({

            id:
                product._id.toString(),

            name:
                product.name,

            category:
                product.maincategory?.name || "",

            subcategory:
                product.subcategory?.name || "",

            brand:
                product.brand?.name || "",

            price:
                product.finalPrice,

            basePrice:
                product.basePrice,

            discount:
                product.discount,

            stock:
                product.stock,

            stockQuantity:
                product.stockQuantity,

            colors:
                product.color,

            sizes:
                product.size,

            description:
                product.description

        }))


        // --------------------------------------------------
        // GEMINI PROMPT
        // --------------------------------------------------

        const prompt = `
You are ShopMart AI Assistant.

You help customers find products from the ShopMart e-commerce store.

IMPORTANT RULES:

1. Use ONLY the products provided below.
2. Never invent a product.
3. Never invent a price, brand, stock or product ID.
4. Select products only from the provided products.
5. Return maximum 6 products.
6. Keep the answer short and helpful.
7. Return ONLY valid JSON.
8. Do not use markdown.
9. Do not add any text outside JSON.

Your response MUST follow exactly this structure:

{
    "answer": "Short helpful response",
    "productIds": ["product_id_1", "product_id_2"]
}

SHOPMART PRODUCTS:

${JSON.stringify(productData, null, 2)}

CUSTOMER QUESTION:

${question}
`


        // --------------------------------------------------
        // GEMINI
        // --------------------------------------------------

        const response =
            await generateAIResponse(prompt)


        // --------------------------------------------------
        // PARSE GEMINI RESPONSE
        // --------------------------------------------------

        let aiResult


        try {

            aiResult =
                JSON.parse(response.text)

        } catch (parseError) {

            console.log(
                "AI JSON Parse Error:",
                parseError
            )

            console.log(
                "AI Raw Response:",
                response.text
            )

            return res.status(500).json({

                success: false,

                message:
                    "AI returned invalid structured data"

            })
        }


        // --------------------------------------------------
        // SELECT REAL PRODUCTS
        // --------------------------------------------------

        const selectedProducts =
            products.filter(product =>

                aiResult.productIds?.includes(
                    product._id.toString()
                )

            )


        // --------------------------------------------------
        // FINAL PRODUCT DATA
        // --------------------------------------------------

        const finalProducts =
            selectedProducts.map(product => ({

                id:
                    product._id,

                name:
                    product.name,

                price:
                    product.finalPrice,

                basePrice:
                    product.basePrice,

                discount:
                    product.discount,

                stock:
                    product.stock,

                pic:
                    product.pic,

                brand:
                    product.brand?.name || "",

                category:
                    product.maincategory?.name || "",

                subcategory:
                    product.subcategory?.name || "",

                colors:
                    product.color,

                sizes:
                    product.size

            }))


        // --------------------------------------------------
        // FINAL RESPONSE
        // --------------------------------------------------

        return res.status(200).json({

            success: true,

            message:
                "AI response generated successfully",

            answer:
                aiResult.answer,

            products:
                finalProducts

        })


    } catch (error) {

        console.log(
            "AI Assistant Error:",
            error
        )


        return res.status(500).json({

            success: false,

            message:
                error.message

        })
    }
}


module.exports = {
    askAI
}
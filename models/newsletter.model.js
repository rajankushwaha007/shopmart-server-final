const mongoose = require("mongoose")

const NewsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email Address Field is Mendatory"],
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    }
})
const Newsletter = new mongoose.model("Newsletter", NewsletterSchema)
module.exports = Newsletter
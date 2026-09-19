const mongoose = require("mongoose")

const FeatureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Feature Name Field is Mendatory"],
        unique: true
    },
    shortDescription: {
        type: String,
        required: [true, "Feature Short Description Field is Mendatory"],
        unique: true
    },
    icon: {
        type: String,
        required: [true, "Feature Icon Field is Mendatory"]
    },
    status: {
        type: Boolean,
        default: true
    }
})
const Feature = new mongoose.model("Feature", FeatureSchema)
module.exports = Feature
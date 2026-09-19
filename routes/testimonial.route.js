const TestimonialRouter = require("express").Router()
const { verifyPublic, verifyBuyer } = require("../middleware/auth.middleware")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/testimonial.controller")

TestimonialRouter.post("", verifyBuyer, createRecord)
TestimonialRouter.get("", verifyPublic, getRecord)
TestimonialRouter.get("/:_id", verifyPublic, getSingleRecord)
TestimonialRouter.put("/:_id", verifyBuyer, updateRecord)
TestimonialRouter.delete("/:_id", verifyBuyer, deleteRecord)

module.exports = TestimonialRouter
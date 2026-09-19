const CartRouter = require("express").Router()
const { verifyBuyer } = require("../middleware/auth.middleware")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/cart.controller")

CartRouter.post("", verifyBuyer, createRecord)
CartRouter.get("/user/:user", verifyBuyer, getRecord)
CartRouter.get("/:_id", verifyBuyer, getSingleRecord)
CartRouter.put("/:_id", verifyBuyer, updateRecord)
CartRouter.delete("/:_id", verifyBuyer, deleteRecord)

module.exports = CartRouter
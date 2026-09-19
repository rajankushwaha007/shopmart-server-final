const CheckoutRouter = require("express").Router()
const { verifyBuyer, verifyAdmin, verifySuperAdmin } = require("../middleware/auth.middleware")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    getUserRecord,
    order,
    verifyOrder
} = require("../controllers/checkout.controller")

CheckoutRouter.post("", verifyBuyer, createRecord)
CheckoutRouter.get("", verifyAdmin, getRecord)
CheckoutRouter.get("/:_id", verifyAdmin, getSingleRecord)
CheckoutRouter.get("/user/:user", verifyBuyer, getUserRecord)
CheckoutRouter.put("/:_id", verifyAdmin, updateRecord)
CheckoutRouter.delete("/:_id", verifySuperAdmin, deleteRecord)
CheckoutRouter.post("/order", verifyBuyer, order)
CheckoutRouter.post("/verify-order", verifyBuyer, verifyOrder)

module.exports = CheckoutRouter
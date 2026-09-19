const ProductRouter = require("express").Router()
const { productUploader } = require("../middleware/fileUploader.middleware")
const { verifyPublic, verifyAdmin, verifySuperAdmin, verifyBuyer } = require("../middleware/auth.middleware")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    updateRecordByUser,
    deleteRecord
} = require("../controllers/product.controller")

ProductRouter.post("", verifyAdmin, productUploader.array('pic'), createRecord)
ProductRouter.get("", verifyPublic, getRecord)
ProductRouter.get("/:_id", verifyPublic, getSingleRecord)
ProductRouter.put("/:_id", verifyAdmin, productUploader.array('pic'), updateRecord)
ProductRouter.put("/user/:_id", verifyBuyer, updateRecordByUser)
ProductRouter.delete("/:_id", verifySuperAdmin, deleteRecord)

module.exports = ProductRouter
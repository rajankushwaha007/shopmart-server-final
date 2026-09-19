const FaqRouter = require("express").Router()
const { verifyPublic, verifyAdmin, verifySuperAdmin } = require("../middleware/auth.middleware")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/faq.controller")

FaqRouter.post("", verifyAdmin, createRecord)
FaqRouter.get("", verifyPublic, getRecord)
FaqRouter.get("/:_id", verifyPublic, getSingleRecord)
FaqRouter.put("/:_id", verifyAdmin, updateRecord)
FaqRouter.delete("/:_id", verifySuperAdmin, deleteRecord)

module.exports = FaqRouter
const MaincategoryRouter = require("express").Router()
const { maincategoryUploader } = require("../middleware/fileUploader.middleware")
const { verifyPublic, verifyAdmin, verifySuperAdmin } = require("../middleware/auth.middleware")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/maincategory.controller")

MaincategoryRouter.post("", verifyAdmin, maincategoryUploader.single('pic'), createRecord)
MaincategoryRouter.get("", getRecord)
MaincategoryRouter.get("/:_id", getSingleRecord)
MaincategoryRouter.put("/:_id", verifyAdmin, maincategoryUploader.single('pic'), updateRecord)
MaincategoryRouter.delete("/:_id", verifySuperAdmin, deleteRecord)

module.exports = MaincategoryRouter
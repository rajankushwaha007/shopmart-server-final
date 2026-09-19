const FeatureRouter = require("express").Router()
const { verifyPublic, verifyAdmin, verifySuperAdmin } = require("../middleware/auth.middleware")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/feature.controller")

FeatureRouter.post("", verifyAdmin, createRecord)
FeatureRouter.get("", verifyPublic, getRecord)
FeatureRouter.get("/:_id", verifyPublic, getSingleRecord)
FeatureRouter.put("/:_id", verifyAdmin, updateRecord)
FeatureRouter.delete("/:_id", verifySuperAdmin, deleteRecord)

module.exports = FeatureRouter
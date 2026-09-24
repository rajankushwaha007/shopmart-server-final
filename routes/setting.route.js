const SettingRouter = require("express").Router()
const { verifyPublic, verifyAdmin } = require("../middleware/auth.middleware")
const {
    createRecord,
    getRecord,
} = require("../controllers/setting.controller")

SettingRouter.post("", verifyAdmin, createRecord)
SettingRouter.get("", getRecord)

module.exports = SettingRouter
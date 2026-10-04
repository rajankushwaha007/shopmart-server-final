const Router = require("express").Router()

const { askAI } = require("../controllers/ai.controller")

Router.post("/assistant", askAI)

module.exports = Router
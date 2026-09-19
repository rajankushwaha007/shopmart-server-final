const express = require("express")
const cors = require("cors")
const path = require("path")


require("dotenv").config()
require("./config/db-connect")

const Router = require("./routes/index.route")
const app = express()
app.use(cors())

app.use(express.json())

app.use("/api", Router)
app.use("/public", express.static("./public"))
app.use(express.static(path.join(__dirname, 'dist')))

app.use((req, res) => {
    express.static(path.join(__dirname, 'dist'))
});


const port = process.env.PORT || 8000
app.listen(port, console.log(`Server is Running at http://localhost:${port}`))

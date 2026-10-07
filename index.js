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

// Serve uploaded images
app.use(
    "/uploads",
    express.static(path.join(__dirname, "public/uploads"))
)

app.use("/public", express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname, 'dist')))

app.use((req, res) => {
    express.static(path.join(__dirname, 'dist', "index.html"))
});


const port = process.env.PORT || 8000
app.listen(port, console.log(`Server is Running at http://localhost:${port}`))

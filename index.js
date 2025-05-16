
const express = require("express")

const dotenv = require("dotenv").config()

const mongoose = require("mongoose")

const jwt = require("jsonwebtoken")

const bcrypt = require("bcryptjs")

const app = express()

app.use(express.json())

const PORT = process.env.PORT || 1010

mongoose.connect(process.env.MONGODB_URL)
.then( () => {
    console.log("MongoDB Connected")

    app.listen(PORT, () => {
    console.log(`Successful, server is running on port ${PORT}`)
})


})




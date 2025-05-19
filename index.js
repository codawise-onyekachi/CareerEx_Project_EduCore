
const express = require("express")

const dotenv = require("dotenv").config()

const mongoose = require("mongoose")

const jwt = require("jsonwebtoken")

const bcrypt = require("bcryptjs")

const Auth = require("./authModel")

const User = require("./userModel")

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

//user's sign-up or registration API

app.post("/sign-up", async (req, res) => {

    try{
        const {email, password, firstName, lastName, state} = req.body

        if(!email){
            return res.status(400).json({
                message: "Please enter your email"
            })
        }

        if(!password) {
            return res.status(400).json({
                message: "Please enter your password"
            })
        }

        const existingUser = await Auth.findOne({email})

        if(existingUser) {
            return res.status(400).json({
                message: "User already exist"
            })
        }

        if(password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least six characters"
            })
        }//Regex was used in the authModel to add more password validation

        const hashedPassword = await bcrypt.hash(password, 12)

        const newUser = new Auth ({
            email, 
            password:hashedPassword, 
            firstName, 
            lastName, 
            state
        })

        await newUser.save()

        //Send the user an email

        res.status(201).json({
            message: "User account created successfully",
            newUser: {email, firstName, lastName, state}
        })
    }catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})


//User's login API

app.post("/login", async (req, res) =>{

    const {email, password} = req.body

    if(!email){
        return res.status(400).json({
            message:"Please enter your email"
        })
    }

    if(!password){
        return res.status(400).json({
            message: "Please enter your password"
        })
    }

    const user = await Auth.findOne({email})

    if(!user){
        return res.status(404).json({
            message:"User account does not exist"
        })
    }

    const isMatched = await bcrypt.compare(password, user?.password)

    if(!isMatched){
        return res.status(400).json({
            message:"Incorrect email or password"
        })
    }

    //generate a Token for the user once the email and password matches

    const accessToken = jwt.sign(
        {id: user?._id},
        process.env.ACCESS_TOKEN,
        {expiresIn:"10m"}
    )

    const refreshToken = jwt.sign(
        {id: user?._id},
        process.env.REFRESH_TOKEN,
        {expiresIn: "30d"}
    )

    res.status(200).json({
        message: "Login successfully",
        accessToken,
        user:{
            email: user?.email, 
            firstName: user?. firstName, 
            lastName: user?. lastName, 
            state: user?. state
        },
        refreshToken
    })
})




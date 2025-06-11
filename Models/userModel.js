
// // schemas/user.js
// const mongoose = require('mongoose')

// const userSchema = new mongoose.Schema({
//   firstName: {type: String, required: true, trim: true},
//   lastName: {type: String, required: true, trim: true},
//   email: {type: String, required:true, unique: true},
//   password: {type: String, required: true, minlength: 6},
//   role: {type: String, enum: ['user', 'instructor'], default: 'user'},
//   profile: {bio: String, avatarUrl: String, contactNumber: String, state: String},
//   enrolledCourses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}],
//   createdCourses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}],
//   verified: { type: Boolean,default: false},
//   resetToken: String,
//   resetTokenExpiration: Date
// }, { timestamps: true });

// const User = new mongoose.model("User", userSchema)

// module.exports = User

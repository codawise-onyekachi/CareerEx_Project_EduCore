
const mongoose = require("mongoose")
const { type } = require("os")


const authSchema = new mongoose.Schema({
    // email: {type:String, require:true},
    // password: {type:String, require:true},
    // firstName: {type:String, default:""},
    // lastName: {type:String, default:""},
    // state: {type:String, default:""},
    // verified: {type:Boolean, default:false}
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, required: true, trim: true},
    email: {type: String, required:true, unique: true},
    password: {type: String, required: true, minlength: 6},
    role: {type: String, enum: ['user', 'instructor'], default: 'user'},
    profile: {bio: String, avatarUrl: String, contactNumber: String, state: String},
    enrolledCourses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}],
    createdCourses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}],
    verified: { type: Boolean,default: false},
    resetToken: String,
    resetTokenExpiration: Date
}, {password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/.test(v);
      },
      message: 'Password must be at least 6 characters long, include one uppercase letter and one special character.'
    }
  }},{timestamps:true})


  const Auth = new mongoose.model("Auth", authSchema)


  module.exports = Auth
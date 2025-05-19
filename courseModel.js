
const mongoose = require('mongoose')


const courseSchema = new mongoose.Schema({
  courseTitle: {type:String, required: true, trim: true},
  description: {type: String, required:true},
  category: {type: String, enum: ['Programming', 'Video Editing', 'Cathering', 'Baking', 'Language', 'Public Speaking', 'Other'], default: 'Other'},
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  enrolledStudents: [{type: mongoose.Schema.Types.ObjectId,ref: 'User', require:true}],
  lessons: [{title: String, content: String,videoUrl: String, quiz: [{question: String, options: [String], correctAnswer: String }]}],
  thumbnailUrl: {type: String, default: '' },
  price: {type: Number, default: 0},
  isPublished: {type: Boolean, default: false}
}, {  timestamps: true
})

const Course = new mongoose.model("Course", courseSchema)

module.exports = Course

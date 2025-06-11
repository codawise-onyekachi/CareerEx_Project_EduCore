
const mongoose = require('mongoose');

const lessonProgressSchema = new mongoose.Schema({
  student: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
  course: {type: mongoose.Schema.Types.ObjectId, ref: 'Course',required: true},
  completedLessons: [{
     lessonId: {type: mongoose.Schema.Types.ObjectId,required: true },
      completedAt: {type: Date,default: Date.now}
    }],
  isCourseCompleted: { type: Boolean, default: false }
}, {
  timestamps: true
})

const LessonProgress = mongoose.model('LessonProgress', lessonProgressSchema);
module.exports = LessonProgress

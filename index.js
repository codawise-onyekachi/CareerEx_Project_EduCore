
const express = require("express")

const dotenv = require("dotenv").config()

const mongoose = require("mongoose")

const jwt = require("jsonwebtoken")

const bcrypt = require("bcryptjs")

const Auth = require("./Models/authModel")

const User = require("./Models/userModel")

const cors = require("cors")

const Course = require("./Models/courseModel")

const cookieParser = require('cookie-parser')

const routes = require("./Routes")



//const authenticateUser = require("./middleWare")

//const { sendForgotPasswordEmail, sendSignUpVerificationEmail } = require("./sendMail")

//const { validateRegistration, authenticateUser } = require("./middleWare")

const app = express()

app.use(express.json())

app.use(cors())

app.use(cookieParser())

const PORT = process.env.PORT || 1010

mongoose.connect(process.env.MONGODB_URL)
.then( () => {
    console.log("MongoDB Connected")

    app.listen(PORT, () => {
    console.log(`Successful, server is running on port ${PORT}`)
})


})

// test deployment
app.get("/", (req, res) => {
    res.status(200).json({
        message:"welcome to careerEx Backend Website"
    })
})

//delete all app except one 
app.use("/api", routes)

//user's sign-up or registration API

//app

//User's login API

//app

//logout
  //app

//forgot-password
//app


//reset-password
//app

// POST: Add a new course (only for instructors)
//app

// GET all available courses
//app

// Route: GET /courses/:courseId — view detailed info for a selected course
//app

// Enroll student in a course
//app


// View students enrolled in a course (Instructor only)
//app

//view course category
//app


// GET: Students can view their enrolled courses
//app

//  Endpoint to check and mark course as completed
// app.post('/api/check-course-completion', async (req, res) => {
//   const { studentId, courseId } = req.body;

//   try {
//     const course = await Course.findById(courseId);
//     const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });

//     if (!course || !enrollment) {
//       return res.status(404).json({ message: 'Course or Enrollment not found' });
//     }

//     const totalLessons = course.lessons.length;
//     const completedLessons = (studentLessonProgress[studentId]?.[courseId] || []).length;

//     if (completedLessons >= totalLessons) {
//       enrollment.courseCompleted = true;
//       await enrollment.save();
//       return res.status(200).json({ message: 'Course marked as completed.' });
//     } else {
//       enrollment.courseCompleted = false;
//       await enrollment.save();
//       return res.status(200).json({ message: 'Course not yet completed.' });
//     }

//   } catch (err) {
//     return res.status(500).json({ message: 'Server error', error: err.message });
//   }
// })


// Endpoint to check and mark course as completed through lessonProgressModel

//app


//all-users
//app

// Middleware to protect routes
// function auth(req, res, next) {
//   const token = req.header('Authorization')?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: 'No token provided' });

//   try {
//     req.user = jwt.verify(token, process.env.JWT_SECRET);
//     next();
//   } catch {
//     res.status(400).json({ message: 'Invalid token' });
//   }
// }

// // Middleware to check role
// function checkRole(...allowed) {
//   return (req, res, next) => {
//     if (!allowed.includes(req.user.role))
//       return res.status(403).json({ message: 'Access denied' });
//     next();
//   };
// }

// // Protected route: Instructor only
// app.get('/instructor/dashboard', auth, checkRole('instructor'), (req, res) => {
//   res.json({ message: 'Welcome Instructor!' });
// });

// // Protected route: Student only
// app.get('/student/dashboard', auth, checkRole('student'), (req, res) => {
//   res.json({ message: 'Welcome Student!' });
// });

// // Protected route: Admin only
// app.get('/admin/dashboard', auth, checkRole('admin'), (req, res) => {
//   res.json({ message: 'Welcome Admin!' });
// });





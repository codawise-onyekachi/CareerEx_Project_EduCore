
const express = require("express")

const dotenv = require("dotenv").config()

const mongoose = require("mongoose")

const jwt = require("jsonwebtoken")

const bcrypt = require("bcryptjs")

const Auth = require("./authModel")

const User = require("./userModel")

const cors = require("cors")

const Course = require("./courseModel")

const LessonProgress = require("./lessonProgressModel")

const Enrollment = require("./enrollModel")

//const authenticateUser = require("./middleWare")

const { sendForgotPasswordEmail, sendSignUpVerificationEmail } = require("./sendMail")

const { validateRegistration, authenticateUser } = require("./middleWare")

const app = express()

app.use(express.json())

app.use(cors())

const PORT = process.env.PORT || 1010

mongoose.connect(process.env.MONGODB_URL)
.then( () => {
    console.log("MongoDB Connected")

    app.listen(PORT, () => {
    console.log(`Successful, server is running on port ${PORT}`)
})


})

//user's sign-up or registration API

app.post("/sign-up", validateRegistration, async (req, res) => {

    try{
        const {email, password, firstName, lastName, role} = req.body

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
            role
        })

        await newUser.save()
        await sendSignUpVerificationEmail(newUser)//Send the user an email

        res.status(201).json({
            message: "User account created successfully",
            newUser: {email, firstName, lastName, role}
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
            role: user?. role
        },
        refreshToken
    })
})

app.post("/forgot-password", async (req, res) => {
     try{

     const {email} = req.body

    // const {email, userName} = req.body

    // let user

    // if(email){
    //     const user = await Auth.findOne({email})
    // }

    //   if(userName){
    //     const user = await Auth.findOne({userName})
    // }
  

    const user = await Auth.findOne({email})



    if(!user) {
        res.status(404).json({
            message: "User not found"
        })
    }

    //In case where the email matches with the user, that is , user exist, then an email with the Token or OTP is sent to them 
    const accessToken = await jwt.sign(
        {user},
        process.env.ACCESS_TOKEN,
        {expiresIn:"5m"}

    )

    await sendForgotPasswordEmail(email, accessToken)

    res.status(200).json({
        message: "Please check your email inbox"
    })
}catch (error) {
        res.status(500).json({
            message: error.message
        })

    }
})




app.patch("/reset-password", authenticateUser, async (req, res) => {

    try{

    const {email, password} = req.body

    const user = await Auth.findOne({email: req.body.email})

    if(!user){
        res.status(404).json({
            message:"User not found"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    user.password = hashedPassword

    await user.save()

    res.status(200).json({
        message:"Password reset successful"
    })

}catch (error) {
        res.status(500).json({
            message: error.message
        })

    }

})


// POST: Add a new course (only for instructors)

app.post('/add-courses', async (req, res) => {
  try {
    const { courseTitle, description, category, lessons, thumbnailUrl, price } = req.body

    // Ensure only instructors can add courses
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ 
        message: 'Access denied: Only instructors can add courses' 
    })
    }

    // Create new course
    const newCourse = new Course({
      courseTitle,
      description,
      category,
      lessons,
      thumbnailUrl,
      price,
      createdBy: req.user.id, // From token
      isPublished: true // Optional: Set to false if you want manual publish
    })

    await newCourse.save();

    res.status(201).json({
      message: 'Course added successfully',
      course: newCourse
    })

  } catch (error) {
    res.status(500).json({
      message: 'Error adding course',
      error: error.message
    })
  }
})

// GET all available courses
app.get('/all-courses', async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).select(
      '_id courseTitle description category price thumbnailUrl'
    )

    res.status(200).json({
      message: 'Available courses fetched successfully',
      courses,
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching courses',
      error: error.message
    })
  }
})


// Route: GET /courses/:courseId — view detailed info for a selected course
app.get('/courses/:courseId', async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId)
      .populate('createdBy', 'firstName lastName email') // Show instructor info
      .select('-__v'); // to exclude __v

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course details fetched successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
})


// Enroll student in a course
app.post("/enroll/:courseId", async (req, res) => {
  try {
    const userId = req.user._id
    const role = req.user.role
    const { courseId } = req.params

    if (role !== 'user') {
      return res.status(403).json({ 
        message: 'Only students can enroll'
     })
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        message: 'Course not found' 
    })
    }

    const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (existingEnrollment) {
      return res.status(400).json({ 
        message: 'Already enrolled' 
    })
    }

    const enrollment = new Enrollment({ user: userId, course: courseId })

    await enrollment.save()

    res.status(200).json({ 
        message: 'Enrollment successful', 
        enrollment 
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


// View students enrolled in a course (Instructor only)

app.get('/course/:courseId/enrollments', async (req, res) => {
  try {
    const instructorId = req.user._id
    const role = req.user.role
    const { courseId } = req.params

    if (role !== 'instructor') {
      return res.status(403).json({ 
        message: 'Only instructors can view enrollments' 
    })
    }

    const course = await Course.findById(courseId)
    if (!course || course.instructor.toString() !== instructorId.toString()) {
      return res.status(403).json({
        message: 'Not authorized to view enrollments for this course' 
    })
    }

    const enrollments = await Enrollment.find({ course: courseId }).populate('user', 'firstName lastName email')

    res.status(200).json({ user: enrollments });
  } catch (error) {
    res.status(500).json({
         message: error.message
         })
  }
})


app.get('/courses/category/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params;

    // Validate category (optional)
    const validCategories = [
      'Programming',
      'Video Editing',
      'Cathering',
      'Baking',
      'Language',
      'Public Speaking',
      'Other'
    ];

    if (!validCategories.includes(categoryName)) {
      return res.status(400).json({ 
        message: 'Invalid course category'
     })
    }

    // Fetch courses in the specified category
    const courses = await Course.find({
      category: categoryName,
      isPublished: true
    }).select('courseTitle description category thumbnailUrl price')

    res.status(200).json({
      message: `Courses in category: ${categoryName}`,
      total: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching courses by category',
      error: error.message
    })
  }
})


// GET: Students can view their enrolled courses
app.get('/students/:studentId/enrollments', async (req, res) => {
  const { studentId } = req.params;

  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        select: 'courseTitle description category thumbnailUrl price isPublished',
      })

    //const enrolledCourses = enrollments.map(enrollment => enrollment.course)
    const enrolledCourses = enrollments.map(enrollment => ({
      enrollmentId: enrollment._id,
      enrolledAt: enrollment.enrolledAt,
      ...enrollment.course._doc
}))


    res.status(200).json({
      message: 'Enrolled courses retrieved successfully',
      total: enrolledCourses.length,
      courses: enrolledCourses,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch enrolled courses',
      error: error.message,
    })
  }
})


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

app.post('/update-course-completion-status', async (req, res) => {
  const { studentId, courseId, lessonTitle, totalLessons } = req.body;

  try {
    let progress = await LessonProgress.findOne({ student: studentId, course: courseId });

    if (!progress) {
      progress = new LessonProgress({
        student: studentId,
        course: courseId,
        completedLessons: [lessonTitle]
      });
    } else {
      if (!progress.completedLessons.includes(lessonTitle)) {
        progress.completedLessons.push(lessonTitle);
      }
    }

    // Auto-set completion if all lessons are completed
    if (progress.completedLessons.length === totalLessons) {
      progress.isCourseCompleted = true;
    }

    await progress.save();

    res.status(200).json({ message: 'Course Progress updated', progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})



app.get("/all-users", authenticateUser, async (req, res) => {

    try{

    //console.log(req.user)
    
    const allUsers = await Auth.find()

    res.status(200).json({
        message: "Successful",
        allUsers
    })

} catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
})


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






const express = require("express")
const { handleUserRegistration, handleLogin, handleLogout, handleForgotPassword, handleResetPassword, handleGetAllUsers, handlePostNewCourse, handleGetAllCourses, handleViewCourseDetails, handleCourseEnrollment, handleViewStudentEnrolledInACourse, handleGetCourseCategories, handleStudentViewEnrolledCourses, handleCorseCompletionStatus } = require("../Controllers");
const { validateRegistration, authenticateUser } = require("../middleWare")

const router = express.Router()



router.post("/sign-up", validateRegistration, handleUserRegistration)

router.post("/login", handleLogin)

router.post("/logout", handleLogout)

router.post("/forgot-password", handleForgotPassword)

router.patch("/reset-password", authenticateUser, handleResetPassword)

router.get("/all-users", authenticateUser, handleGetAllUsers)

router.post("/add-courses", handlePostNewCourse)

router.get("/all-courses", handleGetAllCourses)

router.get("/courses/:courseId", handleViewCourseDetails)

router.post("/enroll/:courseId", handleCourseEnrollment)

router.get("/course/:courseId/enrollments", handleViewStudentEnrolledInACourse)

router.get("/courses/category/:categoryName", handleGetCourseCategories)

router.get("/students/:studentId/enrollments", handleStudentViewEnrolledCourses)

router.post("/update-course-completion-status", handleCorseCompletionStatus)



module.exports = router
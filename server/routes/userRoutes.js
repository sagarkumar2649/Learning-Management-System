import express from "express";
import { addUserRating, confirmUpiPayment, getUserCourseProgress, getUserData, purchaseCourse, updateUserCourseProgress, userEnrolledCourses } from "../controllers/userController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.use(requireAuth);

userRouter.get('/data', getUserData);
userRouter.get('/enrolled-courses', userEnrolledCourses);
userRouter.post('/purchase', purchaseCourse);
userRouter.post('/confirm-upi-payment', confirmUpiPayment);
userRouter.post('/update-course-progress', updateUserCourseProgress);
userRouter.post('/get-course-progress', getUserCourseProgress);
userRouter.post('/add-rating', addUserRating);

export default userRouter;

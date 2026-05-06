import Course from '../models/Course.js'
import { Purchase } from '../models/Purchase.js'
import User from '../models/User.js'

const normalizeCoursePayload = (courseData) => {
    const parsedCourseData = JSON.parse(courseData);

    parsedCourseData.courseTitle = parsedCourseData.courseTitle?.trim();
    parsedCourseData.courseDescription = parsedCourseData.courseDescription?.trim();
    parsedCourseData.coursePrice = Number(parsedCourseData.coursePrice);
    parsedCourseData.discount = Number(parsedCourseData.discount);
    parsedCourseData.isPublished = parsedCourseData.isPublished ?? true;
    parsedCourseData.courseContent = (parsedCourseData.courseContent || []).map((chapter, chapterIndex) => ({
        ...chapter,
        chapterTitle: chapter.chapterTitle?.trim(),
        chapterOrder: Number(chapter.chapterOrder || chapterIndex + 1),
        chapterContent: (chapter.chapterContent || []).map((lecture, lectureIndex) => ({
            ...lecture,
            lectureTitle: lecture.lectureTitle?.trim(),
            lectureDuration: Number(lecture.lectureDuration),
            lectureUrl: lecture.lectureUrl?.trim(),
            lectureOrder: Number(lecture.lectureOrder || lectureIndex + 1),
            isPreviewFree: Boolean(lecture.isPreviewFree),
        })),
    }));

    return parsedCourseData;
};

const buildEnrolledStudentsData = async (courses) => {
    const courseIds = courses.map(course => course._id);
    const courseById = new Map(courses.map(course => [course._id.toString(), course]));
    const enrolledByStudentAndCourse = new Map();

    const purchases = await Purchase.find({
        courseId: { $in: courseIds },
        status: 'completed'
    }).sort({ createdAt: -1 }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

    purchases.forEach((purchase) => {
        if (!purchase.userId || !purchase.courseId) return;

        enrolledByStudentAndCourse.set(`${purchase.userId._id}-${purchase.courseId._id}`, {
            courseTitle: purchase.courseId.courseTitle,
            student: purchase.userId,
            purchaseDate: purchase.createdAt
        });
    });

    for (const course of courses) {
        const students = await User.find({ _id: { $in: course.enrolledStudents } }, 'name imageUrl');

        students.forEach((student) => {
            const key = `${student._id}-${course._id}`;
            if (!enrolledByStudentAndCourse.has(key)) {
                enrolledByStudentAndCourse.set(key, {
                    courseTitle: courseById.get(course._id.toString()).courseTitle,
                    student,
                    purchaseDate: course.updatedAt
                });
            }
        });
    }

    return [...enrolledByStudentAndCourse.values()].sort(
        (first, second) => new Date(second.purchaseDate) - new Date(first.purchaseDate)
    );
};

const getCourseThumbnailUrl = (imageFile, req) => `${req.protocol}://${req.get('host')}/uploads/${imageFile.filename}`;


// Update role to educator
export const updateRoleToEducator = async (req,res)=>{
    try {
        const userId = req.auth.userId

        await User.findByIdAndUpdate(userId, { role: 'educator' })
        req.user.role = 'educator'

        res.json({success: true, message: 'You can publish a course now'})


    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

//  Add new course 
// export const addCourse = async(req,res) =>{
//     try {
//         const {courseData} = req.body;
//         const imageFile = req.file;
//         const educatorId = req.auth.userId
//         console.log(educatoreId);
//         if(!imageFile){
//             return res.json({success: false, message:"Thumbnail Not Attached"})
//         }

//         const parsedCourseData = await JSON.parse(courseData)
//         parsedCourseData.educator = educatorId
//         const imageUpload = await cloudinary.uploader.upload(imageFile.path)
//         newCourse.courseThumbnail = imageUpload.secure_url
//         const newCourse = await Course.create(parsedCourseData)
//         await newCourse.save()
//         res.json({success: true, message: "Course Added"})



//     } catch (error) {
//         res.json({success: false, message:error.message})
//     }
// }

export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body;
        const imageFile = req.file;
        const educatorId = req.auth.userId;

        // console.log(educatorId);

        if (!courseData) {
            return res.status(400).json({ success: false, message: "Course data is required" });
        }

        if (!imageFile) {
            return res.status(400).json({ success: false, message: "Thumbnail Not Attached" });
        }

        const parsedCourseData = normalizeCoursePayload(courseData);
        parsedCourseData.educator = educatorId;

        if (!parsedCourseData.courseTitle || !parsedCourseData.courseDescription) {
            return res.status(400).json({ success: false, message: "Title and description are required" });
        }

        if (Number.isNaN(parsedCourseData.coursePrice) || Number.isNaN(parsedCourseData.discount)) {
            return res.status(400).json({ success: false, message: "Price and discount must be valid numbers" });
        }

        // Ensure all lectures have required fields
        // if (!parsedCourseData.courseContent?.every(chapter => 
        //     chapter.chapterContent?.every(lecture => lecture.lectureId && lecture.lectureurl)
        // )) {
        //     return res.json({ success: false, message: "Lecture ID and URL are required in all chapters." });
        // }

        parsedCourseData.courseThumbnail = getCourseThumbnailUrl(imageFile, req);

        // Create course after ensuring image is uploaded
        const newCourse = await Course.create(parsedCourseData);
        await newCourse.save()

        res.json({ success: true, message: "Course Added", course: newCourse });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};




// Get educator courses

export const getEducatorCourses = async(req,res) => {
    try {
        // const educator = req.auth
        const educator = req.auth.userId
        const courses = await Course.find({educator}).sort({ createdAt: -1 })
        // console.log(req.auth);
        res.json({success: true, courses})
        
    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

// Delete educator course

export const deleteEducatorCourse = async(req,res) => {
    try {
        const educator = req.auth.userId;
        const { courseId } = req.params;

        const course = await Course.findOne({ _id: courseId, educator });
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found or unauthorized" });
        }

        await Course.deleteOne({ _id: courseId });
        await Purchase.deleteMany({ courseId });
        await User.updateMany(
            { enrolledCourses: courseId },
            { $pull: { enrolledCourses: courseId } }
        );

        res.json({ success: true, message: "Course Deleted" });
    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

// get educatore dashboard data (ttal earnings, enrolled students, No. of courses)

export const educatorDashboardData = async(req,res) =>{
    try {
        const educator = req.auth.userId

        const courses = await Course.find({educator}).sort({ createdAt: -1 });
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id)
        // calculate total earnings from purchases
        const purchases = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completed'
        });

        const totalEarnings =Math.round( purchases.reduce((sum, purchase) => sum + purchase.amount, 0)).toFixed(2)
        
        const enrolledStudentsData = await buildEnrolledStudentsData(courses);

        res.json({success: true, dashboardData: {
            totalEarnings,enrolledStudentsData, totalCourses
        }})
    } catch (error) {
        res.json({success: false, message:error.message})    
    }
}




// Get Enrolled Students Data with purchase data

export const getEnrolledStudentsData = async(req,res) =>{
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({educator}).sort({ createdAt: -1 })
        const enrolledStudents = await buildEnrolledStudentsData(courses);

        res.json({success: true, enrolledStudents});

    } catch (error) {
        res.json({success: false, message:error.message})
    }
}

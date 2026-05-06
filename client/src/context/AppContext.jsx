import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
import { dummyCourses } from "../assets/assets";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
	const currency = import.meta.env.VITE_CURRENCY || "USD";
	const navigate = useNavigate();
	const { user, getToken, openAuthModal, logout, refreshUser } = useAuth();

	const [allCourses, setAllCourses] = useState(dummyCourses);
	const [isEducator, setIsEducator] = useState(false);
	const [enrolledCourses, setEnrolledCourses] = useState([]);
	const [userData, setUserData] = useState(null);
	const localEnrollmentKey = "edemy_local_enrolled_courses";
	const localRatingKey = "edemy_local_course_ratings";

	const getLocalRatings = () => JSON.parse(localStorage.getItem(localRatingKey) || "{}");

	const applyLocalRating = (course) => {
		if (!course?._id) return course;

		const localRatings = getLocalRatings();
		const rating = localRatings[course._id];
		if (!rating) return course;

		const userId = userData?._id || user?._id || "local-user";
		const courseRatings = Array.isArray(course.courseRatings) ? course.courseRatings : [];
		const existingRatingIndex = courseRatings.findIndex((item) => item.userId === userId);
		const nextRatings = [...courseRatings];

		if (existingRatingIndex > -1) {
			nextRatings[existingRatingIndex] = { ...nextRatings[existingRatingIndex], rating };
		} else {
			nextRatings.push({ userId, rating });
		}

		return { ...course, courseRatings: nextRatings };
	};

	const mergeWithDummyCourses = (courses = []) => {
		const courseMap = new Map();

		[...courses, ...dummyCourses].forEach((course) => {
			if (course?._id && !courseMap.has(course._id)) {
				courseMap.set(course._id, applyLocalRating(course));
			}
		});

		return [...courseMap.values()];
	};

	const getLocalEnrolledCourses = () => {
		const enrolledIds = JSON.parse(localStorage.getItem(localEnrollmentKey) || "[]");
		return enrolledIds
			.map((courseId) =>
				dummyCourses.find((course) => course._id === courseId) ||
				allCourses.find((course) => course._id === courseId)
			)
			.map(applyLocalRating)
			.filter(Boolean);
	};

	const mergeEnrolledCourses = (courses = []) => {
		const courseMap = new Map();

		[...courses, ...getLocalEnrolledCourses()].forEach((course) => {
			if (course?._id && !courseMap.has(course._id)) {
				courseMap.set(course._id, applyLocalRating(course));
			}
		});

		return [...courseMap.values()];
	};

	const enrollLocalCourse = (course) => {
		if (!course?._id) return;

		const enrolledIds = JSON.parse(localStorage.getItem(localEnrollmentKey) || "[]");
		if (!enrolledIds.includes(course._id)) {
			localStorage.setItem(localEnrollmentKey, JSON.stringify([course._id, ...enrolledIds]));
		}

		setEnrolledCourses((currentCourses) => mergeEnrolledCourses([course, ...currentCourses]));
	};

	const rateLocalCourse = (courseId, rating) => {
		const localRatings = getLocalRatings();
		localStorage.setItem(localRatingKey, JSON.stringify({ ...localRatings, [courseId]: rating }));

		setAllCourses((currentCourses) =>
			currentCourses.map((course) => course._id === courseId ? applyLocalRating({ ...course }) : course)
		);
		setEnrolledCourses((currentCourses) =>
			currentCourses.map((course) => course._id === courseId ? applyLocalRating({ ...course }) : course)
		);
	};

	const fetchAllCourses = async () => {
		try {
			const { data } = await axios.get(backendUrl + "/api/course/all");
			if (data.success) {
				setAllCourses(mergeWithDummyCourses(data.courses));
			} else {
				setAllCourses(dummyCourses);
			}
		} catch {
			setAllCourses(dummyCourses);
		}
	};

	const fetchUserData = async () => {
		try {
			const token = await getToken();
			if (!token) return;

			const { data } = await axios.get(backendUrl + "/api/user/data", {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (data.success) {
				setUserData(data.user);
				setIsEducator(data.user.role === "educator");
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.response?.data?.message || error.message);
		}
	};

	const calculateRating = (course) => {
		const courseRatings = course?.courseRatings || [];
		if (courseRatings.length === 0) return 0;
		let totalRating = 0;
		courseRatings.forEach((rating) => {
			totalRating += rating.rating;
		});
		return Math.floor(totalRating / courseRatings.length);
	};

	const calculateChapterTime = (chapter) => {
		let time = 0;
		chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration));
		return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
	};

	const calculateCourseDuration = (course) => {
		let time = 0;
		course.courseContent.map((chapter) =>
			chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration))
		);
		return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
	};

	const calculateNoOfLectures = (course) => {
		let totalLectures = 0;
		course.courseContent.forEach((chapter) => {
			if (Array.isArray(chapter.chapterContent)) {
				totalLectures += chapter.chapterContent.length;
			}
		});
		return totalLectures;
	};

	const fetchUserEnrolledCourses = async () => {
		try {
			const token = await getToken();
			if (!token) return;

			const response = await axios.get(backendUrl + "/api/user/enrolled-courses", {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (response.data && response.data.enrolledCourses) {
				setEnrolledCourses(mergeEnrolledCourses(response.data.enrolledCourses.reverse()));
			} else {
				toast.error(response.data?.message || "No enrolled courses found.");
				setEnrolledCourses(mergeEnrolledCourses([]));
			}
		} catch (error) {
			toast.error(error.response?.data?.message || error.message);
			setEnrolledCourses(mergeEnrolledCourses([]));
		}
	};

	useEffect(() => {
		fetchAllCourses();
	}, []);

	useEffect(() => {
		if (user) {
			setUserData(user);
			setIsEducator(user.role === "educator");
			fetchUserData();
			fetchUserEnrolledCourses();
		} else {
			setUserData(null);
			setIsEducator(false);
			setEnrolledCourses([]);
		}
	}, [user]);

	const value = {
		currency,
		allCourses,
		navigate,
		isEducator,
		setIsEducator,
		calculateRating,
		calculateChapterTime,
		calculateCourseDuration,
		calculateNoOfLectures,
		fetchUserEnrolledCourses,
		setEnrolledCourses,
		enrolledCourses,
		backendUrl,
		userData,
		setUserData,
		getToken,
		fetchAllCourses,
		enrollLocalCourse,
		rateLocalCourse,
		openAuthModal,
		logout,
		refreshUser,
		user,
	};

	return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

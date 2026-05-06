import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import axios from "axios";
import { toast } from "react-toastify";

const MyCourses = () => {
	const { currency, backendUrl, isEducator, getToken, fetchAllCourses } = useContext(AppContext);
	const [courses, setCourses] = useState(null);
	const [deletingCourseId, setDeletingCourseId] = useState(null);

	const fetchEducatorCourses = async () => {
		// setCourses(allCourses)
		try {
			const token = await getToken();
			const { data } = await axios.get(backendUrl + "/api/educator/courses", {
				headers: { Authorization: `Bearer ${token}` },
			});
			// console.log("data", data.courses);

			data.success && setCourses(data.courses);
		} catch (error) {
			toast.error(error.message);
			console.log(error.message);
		}
	};

	const deleteCourse = async (courseId) => {
		const shouldDelete = window.confirm("Are you sure you want to delete this course?");
		if (!shouldDelete) return;

		try {
			setDeletingCourseId(courseId);
			const token = await getToken();
			const { data } = await axios.delete(`${backendUrl}/api/educator/course/${courseId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (data.success) {
				toast.success(data.message);
				setCourses((currentCourses) =>
					currentCourses.filter((course) => course._id !== courseId)
				);
				await fetchAllCourses();
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.response?.data?.message || error.message);
		} finally {
			setDeletingCourseId(null);
		}
	};

	useEffect(() => {
		if (isEducator) {
			fetchEducatorCourses();
		}
	}, [isEducator]);

	return courses ? (
		<div className="h-full mb-10 flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
			<div className="w-full">
				<h2 className=" pb-4 text-lg font-medium">My Courses</h2>
				<div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
					<table className="md:table-auto table-fixed w-full overflow-hidden">
						<thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
							<tr>
								<th className="px-4 py-3 font-semibold truncate">
									All Courses
								</th>
								<th className="px-4 py-3 font-semibold truncate">
									Courses Price
								</th>
								<th className="px-4 py-3 font-semibold truncate">Earnings</th>
								<th className="px-4 py-3 font-semibold truncate">Students</th>
								<th className="px-4 py-3 font-semibold truncate">
									Course Status
								</th>
								<th className="px-4 py-3 font-semibold truncate">Action</th>
							</tr>
						</thead>

						<tbody className="text-sm text-gray-500">
							{courses.length ? courses.map((course) => (
								<tr key={course._id} className="border-b border-gray-500/20 ">
									<td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
										<img
											src={course.courseThumbnail}
											alt="CoureImage"
											className="w-16 h-10 rounded object-cover bg-gray-100"
										/>
										<span className="truncate hidden md:block">
											{course.courseTitle}
										</span>
									</td>
									<td className="px-4 py-3">
										{course.coursePrice -
											(course.discount * course.coursePrice) / 100 ===
										0
											? ""
											: "$"}{" "}
										{course.coursePrice -
											(course.discount * course.coursePrice) / 100 ===
										0
											? "Free"
											: course.coursePrice -
											  (course.discount * course.coursePrice) / 100}{" "}
									</td>
									<td className="px-4 py-3">
										{currency}{" "}
										{Math.floor(
											course.enrolledStudents.length *
												(course.coursePrice -
													(course.discount * course.coursePrice) / 100)
										).toFixed(2)}{" "}
									</td>

									<td className="px-4 py-3">
										{course.enrolledStudents.length}
									</td>
									<td className="px-4 py-3">
										{new Date(course.createdAt).toLocaleDateString()}
									</td>
									<td className="px-4 py-3">
										<button
											type="button"
											onClick={() => deleteCourse(course._id)}
											disabled={deletingCourseId === course._id}
											className="rounded bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:text-red-300"
										>
											{deletingCourseId === course._id ? "Removing..." : "Remove"}
										</button>
									</td>
								</tr>
							)) : (
								<tr>
									<td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
										No courses added yet.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	) : (
		<Loading />
	);
};

export default MyCourses;

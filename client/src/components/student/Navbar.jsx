import { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { LogOut, UserCircle } from "lucide-react";

const Navbar = () => {
	const isCourseListPage = location.pathname.includes("/course-list");
	const {
		navigate,
		isEducator,
		backendUrl,
		setIsEducator,
		getToken,
		userData,
		openAuthModal,
		logout,
		refreshUser,
	} = useContext(AppContext);

	const becomeEducator = async () => {
		try {
			if (!userData) {
				openAuthModal("login");
				return;
			}

			if (isEducator) {
				navigate("/educator");
				return;
			}

			const token = await getToken();
			const { data } = await axios.get(backendUrl + "/api/educator/update-role", {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (data.success) {
				setIsEducator(true);
				await refreshUser();
				toast.success(data.message);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.response?.data?.message || error.message);
		}
	};

	return (
		<div
			className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-3 ${
				isCourseListPage ? "bg-white" : "bg-cyan-100/70"
			} `}
		>
			<img
				onClick={() => navigate("/")}
				src={assets.logo}
				alt="Logo"
				className="w-28 lg:w-32 cursor-pointer"
			/>

			<div className="hidden md:flex items-center gap-5 text-gray-500">
				{userData && (
					<>
						<button onClick={becomeEducator}>{isEducator ? "Educator Dashboard" : "Become Educator"}</button>
						<span>|</span>
						<Link to="/my-enrollments">My Enrollments</Link>
					</>
				)}

				{userData ? (
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2 text-sm text-gray-700">
							<img
								src={userData.imageUrl || assets.user_icon}
								alt="profile"
								className="h-8 w-8 rounded-full object-cover"
							/>
							<span className="max-w-32 truncate">{userData.name}</span>
						</div>
						<button onClick={logout} className="rounded-full p-2 text-gray-600 hover:bg-white" type="button">
							<LogOut size={18} />
						</button>
					</div>
				) : (
					<div className="flex items-center gap-3">
						<button onClick={() => openAuthModal("login")} className="text-gray-700 hover:text-blue-600">
							Login
						</button>
						<button
							onClick={() => openAuthModal("register")}
							className="bg-blue-600 text-white px-5 py-2 rounded-full"
						>
							Sign Up
						</button>
					</div>
				)}
			</div>

			<div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
				{userData && (
					<div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
						<button onClick={becomeEducator}>{isEducator ? "Dashboard" : "Educator"}</button>
						<span>|</span>
						<Link to="/my-enrollments">Enrollments</Link>
					</div>
				)}

				{userData ? (
					<button onClick={logout} className="rounded-full p-2 text-gray-600 hover:bg-white" type="button">
						<LogOut size={18} />
					</button>
				) : (
					<button onClick={() => openAuthModal("login")} type="button">
						<UserCircle size={28} />
					</button>
				)}
			</div>
		</div>
	);
};

export default Navbar;

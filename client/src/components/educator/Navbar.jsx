import { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { LogOut } from "lucide-react";
const Navbar = () => {
	const { userData, logout } = useContext(AppContext);
	return (
		<div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3">
			<Link to="/">
				<img src={assets.logo} alt="logo" className="w-28 lg:w-32" />
			</Link>

			<div className="flex items-center gap-5 text-gray-500 relative">
				<p>Hi! {userData ? userData.name : "Developers"} </p>
				{userData ? (
					<button onClick={logout} className="rounded-full p-2 text-gray-600 hover:bg-gray-100" type="button">
						<LogOut size={18} />
					</button>
				) : (
					<img className="max-w-8" src={assets.profile_img} alt="profile_img" />
				)}
			</div>
		</div>
	);
};

export default Navbar;

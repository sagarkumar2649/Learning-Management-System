import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
	const [token, setToken] = useState(() => localStorage.getItem("edemy_token"));
	const [user, setUser] = useState(null);
	const [authModal, setAuthModal] = useState({ open: false, mode: "login" });
	const [authLoading, setAuthLoading] = useState(false);

	const saveSession = (newToken, newUser) => {
		localStorage.setItem("edemy_token", newToken);
		setToken(newToken);
		setUser(newUser);
	};

	const openAuthModal = (mode = "login") => setAuthModal({ open: true, mode });
	const closeAuthModal = () => setAuthModal((current) => ({ ...current, open: false }));

	const logout = () => {
		localStorage.removeItem("edemy_token");
		setToken(null);
		setUser(null);
		toast.success("Logged out");
	};

	const getToken = async () => token;

	const login = async ({ email, password }) => {
		setAuthLoading(true);
		try {
			const { data } = await axios.post(`${backendUrl}/api/auth/login`, { email, password });
			if (!data.success) {
				toast.error(data.message);
				return false;
			}
			saveSession(data.token, data.user);
			closeAuthModal();
			toast.success("Login successful");
			return true;
		} catch (error) {
			toast.error(error.response?.data?.message || error.message);
			return false;
		} finally {
			setAuthLoading(false);
		}
	};

	const register = async ({ name, email, password }) => {
		setAuthLoading(true);
		try {
			const { data } = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password });
			if (!data.success) {
				toast.error(data.message);
				return false;
			}
			saveSession(data.token, data.user);
			closeAuthModal();
			toast.success("Account created");
			return true;
		} catch (error) {
			toast.error(error.response?.data?.message || error.message);
			return false;
		} finally {
			setAuthLoading(false);
		}
	};

	const refreshUser = async () => {
		if (!token) return;
		try {
			const { data } = await axios.get(`${backendUrl}/api/auth/me`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (data.success) {
				setUser(data.user);
			}
		} catch {
			localStorage.removeItem("edemy_token");
			setToken(null);
			setUser(null);
		}
	};

	useEffect(() => {
		refreshUser();
	}, [token]);

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				authModal,
				authLoading,
				openAuthModal,
				closeAuthModal,
				login,
				register,
				logout,
				getToken,
				refreshUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used inside AuthProvider");
	}
	return context;
};

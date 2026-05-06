import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AuthModal = () => {
	const { authModal, authLoading, closeAuthModal, login, register } = useAuth();
	const [mode, setMode] = useState(authModal.mode);
	const [form, setForm] = useState({ name: "", email: "", password: "" });

	useEffect(() => {
		setMode(authModal.mode);
	}, [authModal.mode, authModal.open]);

	if (!authModal.open) return null;

	const isRegister = mode === "register";

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (isRegister) {
			await register(form);
			return;
		}
		await login(form);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
			<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
				<div className="mb-5 flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-semibold text-gray-900">
							{isRegister ? "Create Account" : "Login"}
						</h2>
						<p className="mt-1 text-sm text-gray-500">
							{isRegister ? "Use your email and password." : "Welcome back to Edemy."}
						</p>
					</div>
					<button onClick={closeAuthModal} className="rounded p-1 text-gray-500 hover:bg-gray-100" type="button">
						<X size={20} />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					{isRegister && (
						<div>
							<label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
							<input
								type="text"
								value={form.name}
								onChange={(event) => setForm({ ...form, name: event.target.value })}
								className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
								placeholder="Your name"
								required
							/>
						</div>
					)}
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
						<input
							type="email"
							value={form.email}
							onChange={(event) => setForm({ ...form, email: event.target.value })}
							className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
							placeholder="you@example.com"
							required
						/>
					</div>
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
						<input
							type="password"
							value={form.password}
							onChange={(event) => setForm({ ...form, password: event.target.value })}
							className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
							placeholder="Minimum 6 characters"
							minLength={6}
							required
						/>
					</div>

					<button
						type="submit"
						disabled={authLoading}
						className="w-full rounded bg-blue-600 px-4 py-2.5 font-medium text-white disabled:cursor-not-allowed disabled:bg-blue-300"
					>
						{authLoading ? "Please wait..." : isRegister ? "Create Account" : "Login"}
					</button>
				</form>

				<div className="mt-5 text-center text-sm text-gray-600">
					{isRegister ? "Already have an account?" : "New here?"}{" "}
					<button
						type="button"
						onClick={() => setMode(isRegister ? "login" : "register")}
						className="font-medium text-blue-600"
					>
						{isRegister ? "Login" : "Create account"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AuthModal;

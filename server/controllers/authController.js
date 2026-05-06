import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const createToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("Missing JWT_SECRET. Add it to server/.env.");
    }

    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const sanitizeUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    imageUrl: user.imageUrl,
    enrolledCourses: user.enrolledCourses,
});

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, email and password are required." });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists. Please login." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            _id: randomUUID(),
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=0ea5e9&color=fff`,
        });

        const token = createToken(user._id);

        return res.status(201).json({ success: true, token, user: sanitizeUser(user) });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        const token = createToken(user._id);
        user.password = undefined;

        return res.json({ success: true, token, user: sanitizeUser(user) });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.auth.userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        return res.json({ success: true, user: sanitizeUser(user) });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

        if (!token) {
            return res.status(401).json({ success: false, message: "Please login first." });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ success: false, message: "Missing JWT_SECRET. Add it to server/.env." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid token. Please login again." });
        }

        req.auth = { userId: user._id };
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Session expired. Please login again." });
    }
};

export const protectEducator = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== "educator") {
            return res.status(403).json({ success: false, message: "Unauthorized Access!" });
        }

        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

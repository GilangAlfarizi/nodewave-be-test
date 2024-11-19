import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ error: "Unauthorized. No token provided" });
	}

	jwt.verify(token, String(process.env.JWT_SECRET), (err) => {
		if (err) {
			return res.status(403).json({ error: "Invalid token" });
		}

		next();
	});
};

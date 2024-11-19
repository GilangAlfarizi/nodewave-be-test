import {
	BadRequestWithMessage,
	INTERNAL_SERVER_ERROR_SERVICE_RESPONSE,
	ServiceResponse,
} from "$entities/Service";
import Logger from "$pkg/logger";
import { UserLoginDTO, UserRegisterDTO } from "$entities/User";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function register(
	data: UserRegisterDTO
): Promise<ServiceResponse<{}>> {
	try {
		const checkUser = await prisma.user.findUnique({
			where: { email: data.email },
		});
		if (checkUser) {
			return BadRequestWithMessage("User already exists");
		}

		const hashPassword = await bcrypt.hash(data.password, 12);
		data.password = hashPassword;
		const newUser = await prisma.user.create({ data });

		return {
			status: true,
			data: newUser,
		};
	} catch (err) {
		Logger.error(`AuthService.post.register : ${err}`);
		return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
	}
}

export async function login(data: UserLoginDTO): Promise<ServiceResponse<{}>> {
	try {
		const userData = await prisma.user.findUnique({
			where: { email: data.email },
		});
		if (!userData) {
			return BadRequestWithMessage("User not found");
		}

		const checkPassword = await bcrypt.compare(
			data.password,
			userData.password
		);

		if (!checkPassword) {
			return BadRequestWithMessage("Invalid password");
		}

		const token = jwt.sign(
			{
				id: userData.id,
				email: userData.email,
				role: userData.role,
			},
			String(process.env.JWT_SECRET),
			{ expiresIn: "1h" }
		);
		return {
			status: true,
			data: {
				id: userData.id,
				fullName: userData.name,
				role: userData.role,
				token,
			},
		};
	} catch (err) {
		Logger.error(`AuthService.post.login : ${err}`);
		return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
	}
}

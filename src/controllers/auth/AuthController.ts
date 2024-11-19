import {
	handleServiceErrorWithResponse,
	response_success,
} from "$utils/response.utils";
import { Request, Response } from "express";
import * as AuthService from "$services/AuthService";
import { UserLoginDTO, UserRegisterDTO } from "$entities/User";

export async function register(req: Request, res: Response): Promise<Response> {
	const userData: UserRegisterDTO = req.body;
	const registerResponse = await AuthService.register(userData);

	if (!registerResponse.status)
		return handleServiceErrorWithResponse(res, registerResponse);

	return response_success(res, registerResponse.data, "Success");
}

export async function login(req: Request, res: Response): Promise<Response> {
	const userData: UserLoginDTO = req.body;
	const loginResponse = await AuthService.login(userData);
	if (!loginResponse) return handleServiceErrorWithResponse(res, loginResponse);

	return response_success(res, loginResponse, "Success");
}

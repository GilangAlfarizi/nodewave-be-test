import { Router } from "express";
import * as AuthController from "$controllers/auth/AuthController";

const AuthRoutes = Router({ mergeParams: true }); // mergeParams = true -> to enable parsing query params

AuthRoutes.post("/register", AuthController.register);
AuthRoutes.post("/login", AuthController.login);

export default AuthRoutes;

import { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const AuthRoutes = Router();

AuthRoutes.get("/login", AuthController.login);
AuthRoutes.post("/login", AuthController.loginPost);
AuthRoutes.get("/register", AuthController.register);
AuthRoutes.post("/register", AuthController.registerPost);
AuthRoutes.get("/logout", AuthController.logout);

export default AuthRoutes;
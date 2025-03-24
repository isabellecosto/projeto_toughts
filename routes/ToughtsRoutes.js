import ToughtController from "../controllers/ToughtController.js";
import { Router } from "express";
import checkAuth from "../helpers/auth.js";

const ToughtRoutes = Router();

ToughtRoutes.get("/", ToughtController.showAll);
ToughtRoutes.get("/dashboard", checkAuth, ToughtController.dashboard);

export default ToughtRoutes;
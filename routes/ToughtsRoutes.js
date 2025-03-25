import ToughtController from "../controllers/ToughtController.js";
import { Router } from "express";
import checkAuth from "../helpers/auth.js";

const ToughtRoutes = Router();

ToughtRoutes.get("/", ToughtController.showAll);
ToughtRoutes.get("/dashboard", checkAuth, ToughtController.dashboard);
ToughtRoutes.get("/add", checkAuth, ToughtController.createToughts);
ToughtRoutes.post("/add", checkAuth, ToughtController.createToughtSave);
ToughtRoutes.post("/remove", checkAuth, ToughtController.removeTought);
ToughtRoutes.get("/edit/:id", checkAuth, ToughtController.editTought);
ToughtRoutes.post("/edit", checkAuth, ToughtController.editToughtSave);

export default ToughtRoutes;
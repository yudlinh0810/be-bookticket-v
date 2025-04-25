import express from "express";
import {
  addLocationControl,
  deleteLocationControl,
  getAllLocationControl,
  updateLocationControl,
} from "../controllers/location.controller";
import { verifyAccessToken } from "../services/auth.service";
import { authorizeRoles } from "../middlewares/auth.middleware";

const route = express.Router();

route.get("/get-all", getAllLocationControl);
route.post("/add", verifyAccessToken, authorizeRoles("admin"), addLocationControl);
route.put("/update", verifyAccessToken, authorizeRoles("admin"), updateLocationControl);
route.delete("/delete/:id", verifyAccessToken, authorizeRoles("admin"), deleteLocationControl);

export default route;

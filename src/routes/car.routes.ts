import express from "express";
import {
  addCarCTL,
  addImgCarCTL,
  deleteCarCTL,
  deleteImgCarCTL,
  getAllCarCTL,
  getCarByIdCTL,
  getCarByLicensePlateCTL,
  getCarByStatusCTL,
  getCarByTypeAndStatusCTL,
  getCarByTypeCTL,
  updateCarCTL,
  updateImgCarCTL,
} from "../controllers/car.controller";
import {
  validateCreateCar,
  validateCreateCarMiddleware,
  validateUpdateCar,
  validateUpdateCarMiddleware,
} from "../middlewares/car.middleware";
import { validateToken } from "../middlewares/user.middleware";
import { RequestWithCar } from "../@types/car.type";
import { successResponse } from "../utils/response.util";
import { CarStatus, CarType } from "../@types/car.type";
import {
  uploadImages,
  uploadImagesToCloudinary,
  uploadImageToCloudinary,
} from "../middlewares/uploadHandler";
import pool from "../config/database";
import { uploadImage } from "../middlewares/multerConfig";
import { verifyAccessToken } from "../utils/jwt.util";
import { authorizeRoles } from "../middlewares/auth.middleware";

const carRouter = express.Router();
carRouter.post(
  "/add",
  // validateCreateCar,
  // validateCreateCarMiddleware,
  uploadImages,
  uploadImagesToCloudinary,
  addCarCTL
);
carRouter.put(
  "/update",
  // validateUpdateCar,
  // validateUpdateCarMiddleware,
  uploadImages,
  uploadImagesToCloudinary,
  updateCarCTL
);
carRouter.post("/add-img", verifyAccessToken, authorizeRoles("admin"), addImgCarCTL);
carRouter.put(
  "/image/update",
  verifyAccessToken,
  authorizeRoles("admin"),
  uploadImage,
  uploadImageToCloudinary,
  updateImgCarCTL
);
carRouter.delete("/image/delete", verifyAccessToken, authorizeRoles("admin"), deleteImgCarCTL);
carRouter.delete("/delete/:id", verifyAccessToken, authorizeRoles("admin"), deleteCarCTL);
carRouter.get("/get-all", verifyAccessToken, authorizeRoles("admin"), getAllCarCTL);
carRouter.get("/detail/:id", verifyAccessToken, authorizeRoles("admin", "customer"), getCarByIdCTL);
carRouter.get(
  "/license-plate/:licensePlate",
  verifyAccessToken,
  authorizeRoles("admin", "customer"),
  getCarByLicensePlateCTL
);
carRouter.post("/type/:type", verifyAccessToken, authorizeRoles("admin"), getCarByTypeCTL);
carRouter.post("/status/:status", verifyAccessToken, authorizeRoles("admin"), getCarByStatusCTL);
carRouter.post(
  "/type/:type/status/:status",
  verifyAccessToken,
  authorizeRoles("admin"),
  getCarByTypeAndStatusCTL
);
// carRouter.get("/get", async (req, res) => {
//   try {
//     const client = await pool.connect();
//     const result = await client.query("SELECT NOW()"); // Kiểm tra kết nối bằng truy vấn thời gian hiện tại
//     client.release();

//     res.json({
//       message: "Connected to PostgreSQL!",
//       serverTime: result.rows[0].now,
//     });
//   } catch (err) {
//     console.error("Connection error:", err);
//     res.status(500).json({ message: "Database connection failed", error: err });
//   }
// });

export default carRouter;
// Compare this snippet from be-booktickets/src/controllers/car.controller.ts:

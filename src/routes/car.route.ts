import express from "express";
import {
  createCarCTL,
  deleteCarCTL,
  getAllCarCTL,
  getCarByIdCTL,
  getCarByLicensePlateCTL,
  getCarByStatusCTL,
  getCarByTypeAndStatusCTL,
  getCarByTypeCTL,
  updateCarCTL,
} from "../controllers/car.controller";
import {
  validateCreateCar,
  validateCreateCarMiddleware,
  validateUpdateCar,
  validateUpdateCarMiddleware,
} from "../middlewares/car.middleware";
import { validateToken } from "../middlewares/user.middleware";
import { RequestWithCar } from "../types/car.type";
import { successResponse } from "../utils/response.util";
import { CarStatus, CarType } from "../types/car.type";

const carRouter = express.Router();
carRouter.post("/add", validateCreateCar, validateCreateCarMiddleware, createCarCTL);
carRouter.put("/update/:id", validateUpdateCar, validateUpdateCarMiddleware, updateCarCTL);
carRouter.delete("/delete/:id", deleteCarCTL);
carRouter.get("/get-all", getAllCarCTL);
carRouter.get("/details/:id", getCarByIdCTL);
carRouter.get("/license-plate/:licensePlate", getCarByLicensePlateCTL);
carRouter.get("/type/:type", getCarByTypeCTL);
carRouter.get("/status/:status", getCarByStatusCTL);
carRouter.get("/type/:type/status/:status", getCarByTypeAndStatusCTL);

export default carRouter;
// Compare this snippet from be-booktickets/src/controllers/car.controller.ts:

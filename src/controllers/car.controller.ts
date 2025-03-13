import { Request, Response } from "express";
import {
  createCarSer,
  deleteCarSer,
  getAllCarSer,
  getCarByIdSer,
  getCarByLicensePlateSer,
  getCarByStatusSer,
  getCarByTypeAndStatusSer,
  getCarByTypeSer,
  updateCarSer,
} from "../services/car.service";
import { errorResponse, successResponse } from "../utils/response.util";
import { CarData, CarStatus, CarType, RequestWithCar, statusMap, typeMap } from "../types/car.type";
import { decode } from "punycode";

export const createCarCTL = async (req: Request, res: Response): Promise<any> => {
  const data: CarData = req.body;
  console.log("data", data);

  try {
    const result = await createCarSer(data);
    return successResponse(res, result, "Car created successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateCarCTL = async (req: Request, res: Response): Promise<any> => {
  const id = Number(req.params.id);
  const data: CarData = req.body;
  console.log("id", id);
  console.log("data", data);
  try {
    const result = await updateCarSer(id, data);
    return successResponse(res, result, "Car updated successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

export const deleteCarCTL = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = Number(req.params.id);
    console.log("id", id);
    const result = await deleteCarSer(id);
    return successResponse(res, result, "Car deleted successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

export const getAllCarCTL = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await getAllCarSer();
    return successResponse(res, result, "Car get all successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

export const getCarByIdCTL = async (req: Request, res: Response): Promise<any> => {
  const id = Number(req.params.id);
  console.log("id", id);
  try {
    const result = await getCarByIdSer(id);
    return successResponse(res, result, "Car get by id successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

export const getCarByLicensePlateCTL = async (req: Request, res: Response): Promise<any> => {
  const licensePlate = req.params.licensePlate;
  console.log("licensePlate", licensePlate);
  try {
    const result = await getCarByLicensePlateSer(licensePlate);
    return successResponse(res, result, "Car get by license plate successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

export const getCarByTypeCTL = async (req: Request, res: Express.Response): Promise<any> => {
  if (!req.params.type || !typeMap[req.params.type]) {
    return errorResponse(res, "Invalid car type", 400);
  }
  try {
    const type = typeMap[req.params.type];
    const result = await getCarByTypeSer(type);
    return successResponse(res, result, "Car get by type successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

export const getCarByStatusCTL = async (req: Request, res: Express.Response): Promise<any> => {
  if (!req.params.status || !statusMap[req.params.status]) {
    return errorResponse(res, "Invalid car status", 400);
  }
  try {
    const status = statusMap[req.params.status];
    const result = await getCarByStatusSer(status);
    return successResponse(res, result, "Car get by status successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

export const getCarByTypeAndStatusCTL = async (
  req: RequestWithCar,
  res: Express.Response
): Promise<any> => {
  if (
    !req.params.type ||
    !req.params.status ||
    !typeMap[req.params.type] ||
    !statusMap[req.params.status]
  ) {
    return errorResponse(res, "Invalid car type or status", 400);
  }
  try {
    const type = typeMap[req.params.type];
    const status = statusMap[req.params.status];

    const result = await getCarByTypeAndStatusSer(type, status);
    return successResponse(res, result, "Car get by type and status successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

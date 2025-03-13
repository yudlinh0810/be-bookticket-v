import express, { NextFunction, Request, Response } from "express";
import { errorHandler } from "../middlewares/error.middleware";
import carRouter from "./car.route";
import customerRouter from "./customer.route";
import locationRouter from "./location.route";

const routes = (app: express.Application): void => {
  // Cấu hình routes
  app.use("/api/location", locationRouter);
  app.use("/api/customer", customerRouter);
  app.use("/api/car", carRouter);

  // Route cho các yêu cầu không tìm thấy
  app.use((req: Request, res: Response): void => {
    res.status(404).json({
      status: "ERROR",
      message: "404 NOT FOUND!",
    });
  });

  // Route xử lý lỗi
  app.use(errorHandler);
};

export default routes;

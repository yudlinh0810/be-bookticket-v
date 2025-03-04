import express, { Request, Response, NextFunction } from "express";
import LocationRouter from "./location.route";

const routes = (app: express.Application): void => {
  // Cấu hình routes
  app.use("/api/location", LocationRouter);

  // Route cho các yêu cầu không tìm thấy
  app.use((req: Request, res: Response): void => {
    res.status(404).json({
      status: "ERROR",
      message: "404 NOT FOUND!",
    });
  });

  // Route xử lý lỗi
  app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
    console.log("Err route", err.stack);
    res.status(500).json({
      status: "Err",
      message: "Internal Server Error!",
    });
  });
};

export default routes;

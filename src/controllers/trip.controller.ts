import { Response } from "express";
import { bookBusTicketsDB } from "../config/db";
import { TripService } from "../services/trip.service";
import { successResponse } from "../utils/response.util";
export class TripController {
  private tripService = new TripService(bookBusTicketsDB);

  getAllCar = async (res: Response) => {
    try {
      const result = await this.tripService.getFormData();
      console.log("result", result);
      successResponse(res, result, "et form-data trip success");
    } catch (error) {
      console.log("err", error);
    }
  };
}

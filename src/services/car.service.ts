import exp from "constants";
import { bookBusTicketsDB } from "../config/db";
import { CarData, CarStatus, CarType } from "../types/car.type";

export const createCarSer = (newCar: CarData): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = "call insert_car(?, ?, ?, ?)";
      const values = [newCar.name, newCar.licensePlate, newCar.type, newCar.status];
      await bookBusTicketsDB.execute(sql, values);
      resolve({
        status: "OK",
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const updateCarSer = (id: number, car: CarData): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = "call update_car(?, ?, ?, ?, ?)";
      const values = [id, car.name, car.licensePlate, car.type, car.status];
      await bookBusTicketsDB.execute(sql, values);
      resolve({
        status: "OK",
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteCarSer = (id: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = "call delete_car(?)";
      await bookBusTicketsDB.execute(sql, [id]);
      resolve({
        status: "OK",
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const getAllCarSer = (): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = "call get_all_car()";
      const [rows] = await bookBusTicketsDB.execute(sql);
      resolve(rows[0]);
    } catch (error) {
      reject(error);
    }
  });
};
export const getCarByIdSer = (id: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = "call get_car_by_id(?)";
      const [rows] = await bookBusTicketsDB.execute(sql, [id]);
      resolve(rows[0]);
    } catch (error) {
      reject(error);
    }
  });
};

export const getCarByLicensePlateSer = (licensePlate: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = "call get_car_by_license_plate(?)";
      const [rows] = await bookBusTicketsDB.execute(sql, [licensePlate]);
      resolve(rows[0]);
    } catch (error) {
      reject(error);
    }
  });
};

export const getCarByTypeSer = (type: CarType): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = "call get_car_by_type(?)";
      const [rows] = await bookBusTicketsDB.execute(sql, [type]);
      resolve(rows[0]);
    } catch (error) {
      reject(error);
    }
  });
};

export const getCarByStatusSer = (status: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = "call get_car_by_status(?)";
      const [rows] = await bookBusTicketsDB.execute(sql, [status]);
      resolve(rows[0]);
    } catch (error) {
      reject(error);
    }
  });
};

export const getCarByTypeAndStatusSer = (type: string, status: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = "call get_car_by_type_and_status(?, ?)";
      const [rows] = await bookBusTicketsDB.execute(sql, [type, status]);
      resolve(rows[0]);
    } catch (error) {
      reject(error);
    }
  });
};

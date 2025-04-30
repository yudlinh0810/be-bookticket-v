import { Trip } from "../@types/trip";

export class TripService {
  private db;

  constructor(db: any) {
    this.db = db;
  }

  getAllCar = async () => {
    try {
      const [rows] = await this.db.execute(
        "select id, license_plate as licensePlate, type from car"
      );
      if (rows.length > 0) {
        return rows;
      } else {
        return null;
      }
    } catch (error) {
      console.log("err", error);
    }
  };
  getAllDriver = async () => {
    try {
      const [rows] = await this.db.execute(
        "select id, full_name as fullName, phone from user where role = 'driver'"
      );
      if (rows.length > 0) {
        return rows;
      } else {
        return null;
      }
    } catch (error) {
      console.log("err", error);
    }
  };
  getAllCoDriver = async () => {
    try {
      const [rows] = await this.db.execute(
        `select id, full_name as fullName, phone from user where role = 'co-driver'`
      );
      if (rows.length > 0) {
        return rows;
      } else {
        return null;
      }
    } catch (error) {
      console.log("err", error);
    }
  };

  getFormData = async () => {
    try {
      const [cars, drivers, coDrivers] = await Promise.all([
        this.getAllCar(),
        this.getAllDriver(),
        this.getAllCoDriver(),
      ]);
      return { cars, drivers, coDrivers };
    } catch (error) {
      return error;
    }
  };

  add = async (newTrip: Trip) => {
    try {
      console.log("trip", newTrip);
    } catch (error) {
      return error;
    }
  };
}

export default TripService;

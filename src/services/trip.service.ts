export class TripService {
  private db;

  constructor(db: any) {
    this.db = db;
  }

  async getAllCar() {
    try {
      const [rows] = await this.db.execute("select id, license_plate as licensePlate from car");
      if (rows > 0) {
        return rows;
      } else {
        return null;
      }
    } catch (error) {
      console.log("err", error);
    }
  }
  async getAllDriver() {
    try {
      const [rows] = await this.db.execute(
        "select id, full_name as fullName from user where role = ?",
        ["driver"]
      );
      if (rows > 0) {
        return rows;
      } else {
        return null;
      }
    } catch (error) {
      console.log("err", error);
    }
  }
  async getAllCoDriver() {
    try {
      const [rows] = await this.db.execute(
        `select id, full_name as fullName from user where role = ?`,
        ["co-driver"]
      );
      if (rows > 0) {
        return rows;
      } else {
        return null;
      }
    } catch (error) {
      console.log("err", error);
    }
  }
  async getAllLocation() {
    try {
      const [rows] = await this.db.execute("select id, name from location");
      if (rows > 0) {
        return rows;
      } else {
        return null;
      }
    } catch (error) {
      console.log("err", error);
    }
  }

  async getFormData() {
    try {
      const [cars, drivers, coDrivers, locations] = await Promise.all([
        this.getAllCar(),
        this.getAllDriver(),
        this.getAllCoDriver(),
        this.getAllLocation(),
      ]);
      console.log("cars", cars);
      console.log("drivers", drivers);
      console.log("co-drivers", coDrivers), console.log("locations", locations);
      return { cars, drivers, coDrivers, locations };
    } catch (error) {
      return error;
    }
  }
}

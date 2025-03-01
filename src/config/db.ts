import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const globalBookTicketsDB = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.GLOBAL_BOOK_TICKETS_DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const bookBusTicketsDB = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.BOOK_BUS_TICKETS_DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export { globalBookTicketsDB, bookBusTicketsDB };

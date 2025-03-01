import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import routes from "./routes/routes.route"; // Import routes từ file `routes.route.ts`
import { errorHandler } from "./middlewares/error.middleware"; // Import middleware lỗi
import { config } from "./config/config";
import initSocket from "./socket";
import { createServer } from "http";

dotenv.config();

const app = express();
const server = createServer(app);

// Middleware cấu hình CORS
app.use(
  cors({
    origin: [process.env.URL_LOCALHOST, process.env.URL_FRONTEND],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Xử lý request body với dữ liệu JSON
app.use(express.json({ limit: "50mb" }));

// Xử lý request body với dữ liệu form
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Xử lý cookies
app.use(cookieParser());

// Khởi động Websocket
const io = initSocket(server);

// Test route
app.get("/", (_, res) => {
  res.send("Server running ...");
});

// Gọi routes
routes(app);

// Middleware xử lý lỗi
app.use(errorHandler);

// Start server
const port = config.PORT || 3003;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

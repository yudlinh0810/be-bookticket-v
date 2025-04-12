import express from "express";

import { uploadImageToCloudinary } from "../middlewares/uploadHandler";
import { uploadImage } from "../middlewares/multerConfig";
import { CustomerController } from "../controllers/customer.controller";

const router = express.Router();
const userController = new CustomerController();

router.get("/get-all", userController.getAll);
router.get("/get-detail/:id", userController.fetch);
router.post("/create", uploadImage, uploadImageToCloudinary, userController.create);
router.put("/update-info/:id", userController.update);
router.put("/update-img", uploadImage, uploadImageToCloudinary, userController.updateImage);
router.delete("/delete/:id", userController.delete
  
);

export default router;

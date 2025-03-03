import { Request, Response, NextFunction } from "express";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.util";
import { uploadImages, uploadVideo } from "./multerConfig";
import deleteOldFile from "../utils/deleteOldFile.util";
import { getCloudinaryFolder } from "../utils/getCloudinaryFolder.util";
import { validateFile } from "../utils/validateFile.util";
import { UploadApiResponse } from "cloudinary";

interface CloudinaryFile {
  public_id: string;
  url: string;
}

interface RequestWithFile extends Request {
  file?: Express.Multer.File & { cloudinaryFile?: CloudinaryFile };
}

interface UploadedFile extends Express.Multer.File {
  cloudinaryImages?: { public_id: string; url: string }[];
}

interface RequestWithFiles extends Request {
  files?: UploadedFile[];
}

const uploadVideoToCloudinary = async (req: RequestWithFile, res: Response, next: NextFunction) => {
  console.log("data", req.body);
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let bodyData;
    try {
      bodyData = JSON.parse(req.body?.data || "{}");
    } catch (error) {
      return res.status(400).json({ message: "Invalid JSON data format" });
    }

    const { id, public_video_id } = bodyData;
    if (!id) return res.status(400).json({ message: "Missing Trip id" });

    const folder = `booking-ticket/bus/trip/${id}`;

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      folder,
      ["mp4", "avi", "mov", "mkv"],
      "video"
    );

    // Delete old video if exists
    if (public_video_id) {
      await deleteOldFile(public_video_id, "video");
    }

    // Assign data to req
    req.file.cloudinaryFile = {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
    };

    next();
  } catch (error) {
    console.error("Upload video error:", error);
    res.status(500).json({ message: "Error uploading video to Cloudinary" });
  }
};

const uploadImageToCloudinary = async (
  req: RequestWithFiles,
  res: Response,
  next: NextFunction
) => {
  console.log("data", req.body);
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let bodyData;
    try {
      bodyData = JSON.parse(req.body?.data || "{}");
    } catch (error) {
      return res.status(400).json({ message: "Invalid JSON data format" });
    }

    const { id, role, public_img_ids } = bodyData;
    if (!id) return res.status(400).json({ message: "Missing user id" });

    const folder = getCloudinaryFolder(id, role);
    if (!folder) return res.status(400).json({ message: "The user does not exist" });

    const uploadImages: { public_id: string; url: string }[] = [];
    const allowedFormats = ["png", "jpg", "jpeg"];

    // Upload all images
    await Promise.all(
      req.files.map(async (file) => {
        if (!validateFile(file.originalname, "image")) {
          throw new Error(
            `Invalid file format: ${file.originalname}, Only jpg, png, jpeg are allowed.`
          );
        }

        const result: UploadApiResponse = await uploadToCloudinary(
          file.buffer,
          folder,
          allowedFormats,
          "image"
        );
        uploadImages.push({ public_id: result.public_id, url: result.secure_url });
      })
    );

    // Delete old images (if any)
    if (public_img_ids && Array.isArray(public_img_ids)) {
      await Promise.all(public_img_ids.map((public_id) => deleteOldFile(public_id, "image")));
    }

    req.files.forEach((file, index) => {
      console.log(`req.files[${index}: ${uploadImages}]`);
      file.cloudinaryImages = uploadImages;
    });

    next();
  } catch (error) {
    console.error("Upload Images error:", error);
    res.status(500).json({ message: "Error uploading images to Cloudinary" });
  }
};

export { uploadImages, uploadImageToCloudinary, uploadVideo, uploadVideoToCloudinary };

import { Request, Response, NextFunction } from "express";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.util";
import { uploadImages, uploadVideo } from "./multerConfig";
import deleteOldFile from "../utils/deleteOldFile.util";
import { getCloudinaryFolder } from "../utils/getCloudinaryFolder.util";
import { validateFile } from "../utils/validateFile.util";
import { UploadApiResponse } from "cloudinary";

export interface CloudinaryAsset {
  asset_id?: string;
  public_id: string;
  version?: number;
  version_id?: string;
  signature?: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type?: string;
  created_at?: string;
  tags?: string[];
  bytes?: number;
  type?: string;
  etag?: string;
  placeholder?: boolean;
  url?: string;
  secure_url: string;
  asset_folder?: string;
  display_name?: string;
  original_filename?: string;
}

interface RequestWithFile extends Request {
  file?: Express.Multer.File & { cloudinaryFile?: CloudinaryAsset };
}

export interface UploadedFile extends Express.Multer.File {
  cloudinaryImages?: CloudinaryAsset[];
}

export interface RequestWithProcessedFiles extends Request {
  processedFiles: UploadedFile[];
  processedFile: CloudinaryAsset;
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
      secure_url: uploadResult.secure_url,
    };

    next();
  } catch (error) {
    console.error("Upload video error:", error);
    res.status(500).json({ message: "Error uploading video to Cloudinary" });
  }
};

const uploadImagesToCloudinary = async (
  req: RequestWithProcessedFiles,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next();
    }
    let files = req.files as Express.Multer.File[];
    let bodyData;
    try {
      bodyData = JSON.parse(req.body?.data || "{}");
      if (!bodyData.email) return next("Email is required");
    } catch (error) {
      return next("Invalid JSON data format");
    }

    const { role } = bodyData;

    if (!role) {
      return next("Missing role");
    }

    const folder = getCloudinaryFolder(role);
    if (!folder) {
      return next("The user does not exist");
    }

    const uploadImages: CloudinaryAsset[] = [];
    const allowedFormats = ["png", "jpg", "jpeg"];

    // Upload all images
    if (files.length > 1) {
      await Promise.all(
        files.map(async (file) => {
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
          uploadImages.push(result);
        })
      );
    } else {
      if (!validateFile(files[0].originalname, "image")) {
        throw new Error(
          `Invalid file format: ${files[0].originalname}, Only jpg, png, jpeg are allowed.`
        );
      }
      const result: UploadApiResponse = await uploadToCloudinary(
        files[0].buffer,
        folder,
        allowedFormats,
        "image"
      );

      if (bodyData.urlPublicImg) {
        await deleteOldFile(bodyData.urlPublicImg, "image");
      }
      req.processedFile = result;
      return next();
    }

    // Delete old images (if any)
    // if (public_img_ids && Array.isArray(public_img_ids)) {
    //   await Promise.all(public_img_ids.map((public_id) => deleteOldFile(public_id, "image")));
    // }

    // req.processedFiles.forEach((file, index) => {
    //   console.log(`req.files[${index}]: ${uploadImages[index]};`);
    //   file.cloudinaryImages = [uploadImages[index]];
    // });

    req.processedFiles = uploadImages.map((image) => ({
      cloudinaryImages: [image],
    })) as UploadedFile[];

    next();
  } catch (error) {
    console.error("Upload Images error:", error);
    res.status(500).json({ message: "Error uploading images to Cloudinary" });
  }
};

export { uploadImages, uploadImagesToCloudinary, uploadVideo, uploadVideoToCloudinary };

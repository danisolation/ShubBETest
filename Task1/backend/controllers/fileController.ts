import { Request, Response } from "express";
import * as fs from "fs";
import multer from "multer";

let latestUploadedFile: string | null = null;

const upload = multer({ dest: "uploads/" });

export const uploadFile = (req: Request, res: Response): void => {
  const file = req.file;

  if (!file) {
    res.status(400).json({ message: "No file uploaded" });
    return; 
  }

  if (!file.originalname.endsWith(".xlsx")) {
    fs.unlinkSync(file.path);
    res
      .status(400)
      .json({ message: "Invalid file format, only .xlsx is allowed" });
    return; 
  }

  latestUploadedFile = file.path;

  res.status(200).json({ message: "File uploaded successfully" });
};

export const getLatestUploadedFile = () => {
  return latestUploadedFile;
};

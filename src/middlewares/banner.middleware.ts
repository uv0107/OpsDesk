import multer from "multer";
import { AppError } from "../errors/AppError";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const uploadBannerImage = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new AppError("Invalid file type", 400)), false;
            return;
        }
    }

});


export const uploadSingleBanner = uploadBannerImage.single("image");


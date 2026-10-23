

import { AppError } from "../errors/AppError";
import { Banner } from "../types/banner";
import { uploadBannerToCloudinary } from "../libs/cloudinary";
import { createAdminBanner, deleteAdminBannerById, findAllAdminBannersFromDb } from "../repositories/admin.banner.repository";
import { clearBannerCache, getBannersCache, setBannerCache } from "../libs/bannerCache";
import { addDeleteCloudinaryImageJob } from "../queues/deleteCloudinaryImages.queue";

export async function createAdminBannerService(
    file: Express.Multer.File,
): Promise<Banner> {
    if (!file) {
        throw new AppError("File not found", 404)
    }
    if (!file.buffer) {
        throw new AppError("Buffer not found", 404)
    }

    const { secureUrl: secure_url, publicId: publicId } = await uploadBannerToCloudinary(
        file.buffer,
        {
            folder: "nodejs-capstone/banner",
        }
    )

    if (!secure_url || !publicId) {
        throw new AppError("Cloudinary upload fail", 500)
    }
    const banner = await createAdminBanner(secure_url, publicId);

    await clearBannerCache();
    return banner;

}

export async function fetchAdminBanners(): Promise<Banner[]> {
    // get the data from the cache.
    const getCachedData = await getBannersCache();
    if (getCachedData) {
        return getCachedData;
    }

    const banners = await findAllAdminBannersFromDb();
    //set the data to the cache.
    await setBannerCache(banners);

    return banners;

    // return banners;
}
export async function deleteAdminBannerService(bannerId: string): Promise<void> {
    // delete the banner from the postgres db and get the publicId;

    const publicId = await deleteAdminBannerById(bannerId);

    if (!publicId) {
        throw new AppError("Banner not found", 404);
    }
    await clearBannerCache();
    // add BullMq job;
    await addDeleteCloudinaryImageJob(publicId);
}

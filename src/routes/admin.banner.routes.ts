import { Router } from "express"
import { authenticate } from "../middlewares/auth.middleware"
import { requireAdmin } from "../middlewares/admin.middleware"
import { uploadSingleBanner } from "../middlewares/banner.middleware"
import { createAdminBannerService, fetchAdminBanners, deleteAdminBannerService } from "../services/admin.banner.service"



export const adminBannerRouter = Router()

adminBannerRouter.use(authenticate, requireAdmin)

adminBannerRouter.post("/", uploadSingleBanner, async (req, res, next) => {
    try {
        const file = req.file as Express.Multer.File;

        const banner = await createAdminBannerService(file);

        res.status(201).json({
            success: true,
            message: "Banner created successfully",
            data: banner,
        });
    }
    catch (error) {
        next(error);
    }

})

adminBannerRouter.get("/", async (req, res, next) => {
    try {

        const banners = await fetchAdminBanners();

        return res.status(200).json({
            success: true,
            message: "Banners fetched successfully",
            data: banners,
        })

    }
    catch (error) {
        next(error);
    }

})

adminBannerRouter.delete("/:bannerId", async (req, res, next) => {
    try {
        await deleteAdminBannerService(req.params.bannerId);

        res.status(200).json({
            success: true,
            message: "Banner deleted successfully"
        })
    } catch (error) {
        next(error);
    }
})
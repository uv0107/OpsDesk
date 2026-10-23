
import { pool } from "../libs/db";
import { Banner } from "../types/banner";

type BannerRow = Banner;

export async function createAdminBanner(
    image_url: string,
    cloudinary_public_url: string
): Promise<BannerRow> {

    const result = await pool.query<BannerRow>(
        "INSERT INTO banners (image_url, cloudinary_public_url) VALUES($1, $2) RETURNING *",
        [image_url, cloudinary_public_url]
    )
    return result.rows[0];
}

export async function findAllAdminBannersFromDb(): Promise<BannerRow[]> {

    const result = await pool.query<BannerRow>(
        `
        SELECT * FROM banners 
        order by reated_at desc
        `
    )

    return result.rows ?? null;
}

export async function deleteAdminBannerById(bannerId: string): Promise<string | null> {

    const result = await pool.query<{ cloudinary_public_url: string }>(
        `DELETE FROM banners 
        WHERE id = $1
        RETURNING cloudinary_public_url`,
        [bannerId]
    )
    return result.rows[0]?.cloudinary_public_url ?? null;
}

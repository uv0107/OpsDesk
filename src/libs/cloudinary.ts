import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env";



type uploadResult = {
    secureUrl: string;
    publicId: string
}

export async function uploadBannerToCloudinary(
    buffer: Buffer,
    options?: { folder?: string }
): Promise<uploadResult> {
    const cloudinaryName = env.cloudinaryCloudName;
    const cloudinaryApiKey = env.cloudinaryApiKey;
    const cloudinaryApiSecret = env.cloudinaryApiSecret;

    if (!cloudinaryName || !cloudinaryApiKey || !cloudinaryApiSecret) {
        throw new Error("missing cloudinary config");
    }

    /*
    - Why: It connects your app to your specific Cloudinary account using your cloud_name.
    - Without it: The SDK doesn't know where to look, causing "Cloud name must be provided" errors.

    - Why: It uses your api_key and api_secret as a digital signature to securely unlock your storage.
    - Without it: Your upload or delete requests will be blocked by Cloudinary for lack of authentication.

    */
    cloudinary.config({
        cloud_name: cloudinaryName,
        api_key: cloudinaryApiKey,
        api_secret: cloudinaryApiSecret,
    })
    return new Promise((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "image",
                folder: options?.folder
            },
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve({
                        secureUrl: result?.secure_url ?? "",
                        publicId: result?.public_id ?? ""
                    })
                }
            }
        )

        uploadStream.end(buffer);
    })


}

export async function deleteAdminBannerFromCloudinary(publicId: string): Promise<void> {
    const cloudinaryName = env.cloudinaryCloudName;
    const cloudinaryApiKey = env.cloudinaryApiKey;
    const cloudinaryApiSecret = env.cloudinaryApiSecret;

    if (!cloudinaryName || !cloudinaryApiKey || !cloudinaryApiSecret) {
        throw new Error("missing cloudinary config");
    }

    cloudinary.config({
        cloud_name: cloudinaryName,
        api_key: cloudinaryApiKey,
        api_secret: cloudinaryApiSecret,
    })
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve()
            }
        })
    })


}

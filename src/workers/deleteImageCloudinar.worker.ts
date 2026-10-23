import { Job, Worker } from "bullmq";
import { deleteAdminBannerFromCloudinary } from "../libs/cloudinary";
import { bullmqConnection } from "../libs/redis";
import { logger } from "../libs/logger";

const QUEUE_NAME = "cloudinary-jobs";
const DELETE_CLOUDINARY_IMAGE_JOB = "delete-cloudinary-image";

type DeleteCloudinaryImageJobData = {
    publicId: string
}

export const deleteCloudinaryImageWorker = new Worker(
    QUEUE_NAME,
    async (job) => {
        if (job.name != DELETE_CLOUDINARY_IMAGE_JOB) {
            return;
        }

        const data = job.data as DeleteCloudinaryImageJobData;

        await deleteAdminBannerFromCloudinary(data.publicId);
    },
    {
        connection: bullmqConnection
    }
);

deleteCloudinaryImageWorker.on("completed", (job) => {
    logger.info(`cloudinary delete job completed:${job.id}`)
})
deleteCloudinaryImageWorker.on("failed", (job, error) => {
    logger.info(
        {
            err: error, jobId: job?.id
        },
        "Cloudinary delete job failed"
    )
})

logger.info("Dlete cloudinary image worker started")
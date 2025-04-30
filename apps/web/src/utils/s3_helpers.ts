import s3Client from "@/lib/s3Client";
import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  ObjectCannedACL,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";

export const deleteS3Folder = async (folderPath: `${string}/`) => {
  try {
    const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!;

    // Step 1: List all objects in the folder
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: folderPath, // Get all files inside the "folder"
    });

    const listedObjects = await s3Client.send(listCommand);

    // Step 2: Check if folder is empty
    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      console.log("Folder is already empty.");
      return;
    }

    // Step 3: Delete all objects in the folder
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: bucketName,
      Delete: {
        Objects: listedObjects.Contents.map((obj) => ({ Key: obj.Key! })),
      },
    });

    await s3Client.send(deleteCommand);

    console.log(`Folder ${folderPath} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting folder:", error);
  }
};

export const uploadFileToS3 = async ({
  Key,
  Body,
  Bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
  ContentType = "image/webp",
  ACL = ObjectCannedACL.public_read,
  ...restParams
}: Omit<PutObjectCommandInput, "Bucket" | "ContentType" | "ACL"> & {
  Bucket?: PutObjectCommandInput["Bucket"];
  ContentType?: PutObjectCommandInput["ContentType"];
  ACL?: PutObjectCommandInput["ACL"];
}) => {
  const uploadParams = {
    Bucket,
    Key,
    Body,
    ContentType,
    ACL,
    ...restParams,
  };
  await s3Client.send(new PutObjectCommand(uploadParams));

  return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${Key}`;
};
export const uploadFileToS3Sync = ({ Key, ...args }: Parameters<typeof uploadFileToS3>[0]) => {
  uploadFileToS3({ Key, ...args });

  return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${Key}`;
};

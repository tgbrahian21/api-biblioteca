import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
const AWS_PUBLIC_KEY = process.env.AWS_PUBLIC_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY_MULTER;


const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEY
    }
});

export async function uploadFile(pathFile) {
    const stream = fs.createReadStream(pathFile)
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: "archivo",
        Body: stream
    }
    const comand = new PutObjectCommand();
    await client.send(comand);
}


export const upload = multer({
    storage: multerS3({
      s3: client,
      bucket: AWS_BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE, // Determina automáticamente el tipo de contenido
      key: function (req, file, cb) {
        // Define el nombre del archivo en S3
        cb(null, Date.now().toString() + '-' + file.originalname);
      }
    })
  });
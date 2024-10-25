import multer from "multer";
import dotenv from "dotenv";
dotenv.config();
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
const AWS_PUBLIC_KEY = process.env.AWS_PUBLIC_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY_MULTER;
// UPLOAD IMAGE
export const uploadFileImage = (req, res) => {
    try {
        const fileName = req.file.key;
        const imgUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_BUCKET_REGION}.amazonaws.com/${fileName}`;
        return res.status(200).json({
            message: "Archivo subido con exito.",
            urlFile: imgUrl,
            error: null
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error al subir el archivo",
            error: err
        });
    }
}


// VALIDATE ERROS MULTER
export const validateErrorsUpload = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            message: "Error de subida de archivo",
            error: err.message
        });
    } else if (err) {
        return res.status(500).json({
            message: "Error interno del servidor",
            error: err.message
        })
    }

    next();
}
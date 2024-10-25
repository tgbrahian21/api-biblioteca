import express from "express";
import { uploadImageSingle } from "../../middleware/imageMiddle.js";
import { uploadFileImage, validateErrorsUpload } from "../../controllers/files/uploadFilesController.js";
import { verifyTokenAndAdmin} from "../../middleware/verifyToken.js";
const router = express.Router();

// UPLOAD IMAGE
router.post('/image', verifyTokenAndAdmin, uploadImageSingle("image"), uploadFileImage);
// VALIDATE ERRORS MULTER
router.use(validateErrorsUpload);
export default router;




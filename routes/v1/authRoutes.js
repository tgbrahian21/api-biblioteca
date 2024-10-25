import { Router } from "express";
import { login, register } from "../../controllers/auth/authController.js";
import { forgotPassword } from "../../controllers/auth/forgotPassController.js";
import resetPass  from "../../controllers/auth/resetPassController.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/forgot-pass", forgotPassword);
router.post("/reset-password/:token/:id", resetPass)

export default router;
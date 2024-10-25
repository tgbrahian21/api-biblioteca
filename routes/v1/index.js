import { Router } from "express";
import routesAuth from "./authRoutes.js"
import routesUser from "./userRoutes.js"
import routerBooks from "./booksRoutes.js"
import routerReports from "./reportRoutes.js"
import routerReserva from "./reservaRoutes.js"
import routerAutor from "./autorRoutes.js"
import uploadFilesRoutes from "./imageRoutes.js"

const router = Router();

router.use("/auth", routesAuth);
router.use("/users", routesUser);
router.use("/books", routerBooks);
router.use("/reports", routerReports);
router.use("/reserva", routerReserva);
router.use("/autor", routerAutor);
router.use("/upload", uploadFilesRoutes);

export default router;
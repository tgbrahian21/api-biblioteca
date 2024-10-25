import { Router } from "express";
import { actualizarReserva, agregarReserva, deleteReserva, encontrarReserva, listarReserva } from "../../controllers/reserva/reservaController.js";
import { verifyToken } from "../../middleware/verifyToken.js";

const router = Router();


router.post("/agregar", agregarReserva);
router.put("/actualizar/:id", actualizarReserva);
router.delete("/borrar/:id", deleteReserva);
router.get("/listar",listarReserva);
router.get("/encontrar/:id",encontrarReserva);

export default router;
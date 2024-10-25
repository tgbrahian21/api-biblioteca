import { Router } from "express";
import { infoReserva, cantidadLibrosRegistrados, cantidadReservasMes, libroMasReservado } from "../../controllers/reports/reportController.js";
import { infoReservas } from "../../controllers/reports/reportDataController.js";
import { verifyTokenAndAdmin } from "../../middleware/verifyToken.js";

const router = Router();

router.get("/infoReservas", infoReserva); //informacion de reservas
router.get("/cantidadLb", cantidadLibrosRegistrados); //cantidad de libros registrados
router.get("/cantidadReMes", cantidadReservasMes); //cantidad de reservas en el mes actual
router.get("/libroMasRe", libroMasReservado); //libro mas reservado en el mes actual
router.get("/DataReservas", infoReservas); //informacion de reservas 




export default router;  
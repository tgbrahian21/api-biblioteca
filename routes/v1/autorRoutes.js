import { Router } from "express";
import { agregarAutor, actualizarAutor, elimiarAutor, encontrarAutor, findAutorAll } from "../../controllers/autor/autorController.js";
import { verifyTokenAndAdmin } from "../../middleware/verifyToken.js";

const router = Router();

router.post("/agregar", verifyTokenAndAdmin, agregarAutor);
router.put("/actualizar/:id", verifyTokenAndAdmin, actualizarAutor);
router.delete("/eliminar/:id", verifyTokenAndAdmin, elimiarAutor);
router.get("/encontrar/:id", encontrarAutor);
router.get("/encontrar", findAutorAll);





export default router;
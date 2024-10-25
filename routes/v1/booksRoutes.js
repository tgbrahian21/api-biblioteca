import { Router } from "express";
import { actualizarLibro, agregarLibro, deleteBook, encontrarLibro, listarLibros } from "../../controllers/books/booksController.js";
import { verifyTokenAndAdmin } from "../../middleware/verifyToken.js";



const router = Router();

router.post("/agregar", verifyTokenAndAdmin, agregarLibro);
router.put("/actualizar/:id", verifyTokenAndAdmin, actualizarLibro);
router.delete("/borrar/:id", verifyTokenAndAdmin, deleteBook);
router.get("/listar", listarLibros);
router.get("/encontrar/:id", encontrarLibro);




export default router;
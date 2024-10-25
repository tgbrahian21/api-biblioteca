import { Router } from "express";
import { udpateUser, deleteUser, findUser, findUserAll, createUser } from "../../controllers/user/userController.js";
import { verifyTokenAndAdmin, verifyTokenAndAuthorization } from "../../middleware/verifyToken.js";


const router = Router();

//rutas que se van a usar
// crear usuario
router.post('/create', verifyTokenAndAdmin, createUser);
//actualizar usuario
router.put('/update/:id', verifyTokenAndAuthorization, udpateUser);
//eliminar usuario
router.delete('/delete/:id', verifyTokenAndAuthorization, deleteUser);
//find user
router.get('/find/:id', verifyTokenAndAuthorization, findUser);
//find all user
router.get('/', verifyTokenAndAdmin, findUserAll);


export default router;


import { Router } from "express";
import { UserAdapter } from "../adapter/UserAdapter";
import { UserApplicationService } from "../../application/UserApplicationService";
import { UserController } from "../controller/UserController";

const router = Router();

//Inicializamos las capas
const userAdapter = new UserAdapter();
const userAppService = new UserApplicationService(userAdapter);
const userController = new UserController(userAppService);

//Definir rutas con manejo de errores
router.get("/", async (req,res)=>{
    await userController.getAllUsers(req,res);
    
});
router.post("/", async (req, res) => {
    try {
        await userController.createUser(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la creación de usuario", error });
    }
});
router.put("/:id", async (req, res) => {
    try {
        await userController.updateUser(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la creación de usuario", error });
    }
});
router.delete("/id/:id", async (req, res) => {
    try {
        await userController.deleteUser(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar usuario", error });
    }
});
router.get("/email/:email", async (req, res) => {
    try {
        await userController.getUserByEmail(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar usuario", error });
    }
});

router.get("/id/:id", async (req, res) => {
    try {
        await userController.getUserById(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar usuario", error });
    }
});

export default router;
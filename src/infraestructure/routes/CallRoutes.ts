import { Router } from "express";
import { CallAdapter } from "../adapter/CallAdapter";
import { CallApplicationService } from "../../application/CallApplicationService";
import { CallController } from "../controller/CallController";

const router = Router();

//Inicializamos las capas
const callAdapter = new CallAdapter();
const callAppService = new CallApplicationService(callAdapter);
const callController = new CallController(callAppService);

//Definir rutas con manejo de errores
router.get("/", async (req,res)=>{
    await callController.getAllCalls(req,res);
});
router.post("/", async (req, res) => {
    try {
        await callController.createCall(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la creación de la llamada", error });
    }
});
router.put("/:id", async (req, res) => {
    try {
        console.log("req", req.body);
        await callController.updateCall(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la creación de la llamada", error });
    }
});
router.delete("/id/:id", async (req, res) => {
    try {
        await callController.deleteCall(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar la llamada", error });
    }
});
router.get("/id/:id", async (req, res) => {
    try {
        await callController.getCallById(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar llamada", error });
    }
});

export default router;
import { Router } from "express";
import { TicketAdapter } from "../adapter/TicketAdapter";
import { TicketApplicationService } from "../../application/TicketApplicationService";
import { TicketController } from "../controller/TicketController";

const router = Router();

//Inicializamos las capas
const ticketAdapter = new TicketAdapter();
const ticketAppService = new TicketApplicationService(ticketAdapter);
const ticketController = new TicketController(ticketAppService);

//Definir rutas con manejo de errores
router.get("/", async (req,res)=>{
    await ticketController.getAllTickets(req,res);
});
router.post("/", async (req, res) => {
    try {
        await ticketController.createTicket(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la creación del ticket", error });
    }
});
router.put("/:id", async (req, res) => {
    try {
        await ticketController.updateTicket(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error en la creación del ticket", error });
    }
});
router.delete("/id/:id", async (req, res) => {
    try {
        await ticketController.deleteTicket(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar el ticket", error });
    }
});
router.get("/id/:id", async (req, res) => {
    try {
        await ticketController.getTicketById(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar el ticket", error });
    }
});

export default router;
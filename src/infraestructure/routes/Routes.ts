import { Router } from "express";
import userRoutes from "./UserRoutes";
import clientRoutes from "./ClientRoutes";
import callRoutes from "./CallRoutes";
import ticketRoutes from "./TicketRoutes";

const router = Router();

// Agrupar rutas por entidad

router.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la API" });
});

router.use("/users", userRoutes);
router.use("/clients", clientRoutes);
router.use("/calls", callRoutes);
router.use("/tickets", ticketRoutes);

export default router;

import { Request, Response } from "express";
import { TicketApplicationService } from "../../application/TicketApplicationService";

export class TicketController {
  private app: TicketApplicationService;

  constructor(application: TicketApplicationService) {
    this.app = application;
  }

  createTicket(req: Request, res: Response) {
    try {
      const { callId, clientId, description, priority, status } = req.body;

      if (!Number.isInteger(callId) || callId <= 0)
        return res.status(400).json({ error: "ID de llamada inválido" });

      if (!Number.isInteger(clientId) || clientId <= 0)
        return res.status(400).json({ error: "ID de cliente inválido" });

      if (typeof description !== "string" || description.trim().length < 10)
        return res.status(400).json({ error: "Descripción demasiado corta" });

      const priorities = ["baja", "media", "alta"];
      if (!priorities.includes(priority.toLowerCase()))
        return res.status(400).json({ error: "Prioridad no válida" });

      if (!Number.isInteger(status) || status < 0 || status > 2)
        return res.status(400).json({ error: "Estado no válido" });

      const ticket = { callId, clientId, description, priority, status };
      const ticketId = this.app.createTicket(ticket);
      return res
        .status(201)
        .json({ message: "Ticket creado con éxito", ticketId });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: "Error interno en el Servidor",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getTicketById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

      const ticket = await this.app.getTicketById(id);
      if (!ticket)
        return res.status(404).json({ error: "Ticket no encontrado" });

      return res.status(200).json(ticket);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: "Error interno del servidor",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getAllTickets(req: Request, res: Response): Promise<Response> {
    try {
      const tickets = await this.app.getAllTickets();
      return res.status(200).json(tickets);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error al obtener tickets", error });
    }
  }

  async updateTicket(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

      const { callId, clientId, description, priority, status } = req.body;

      if (description && description.trim().length < 5)
        return res
          .status(400)
          .json({ error: "La descripción debe tener al menos 5 caracteres" });

      const prioridadesPermitidas = ["baja", "media", "alta"];
      if (priority && !prioridadesPermitidas.includes(priority.toLowerCase()))
        return res.status(400).json({ error: "Prioridad no válida" });

      const updated = this.app.updateTicket(id, {
        callId,
        clientId,
        description,
        priority,
        status,
      });
      if (!updated)
        return res
          .status(404)
          .json({ error: "Ticket no encontrado o sin cambios" });

      return res.status(200).json({ message: "Ticket actualizado con éxito" });
    } catch (error) {
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async deleteTicket(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

      const deleted = await this.app.deleteTicket(id);
      if (!deleted)
        return res.status(404).json({ error: "Ticket no encontrado" });

      return res.status(200).json({ message: "Ticket eliminado con éxito" });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: "Error interno del servidor",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

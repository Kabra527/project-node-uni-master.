import { Request, Response } from "express";
import { CallApplicationService } from "../../application/CallApplicationService";
import { Call } from "../../domain/entities/Call";


export class CallController {
  private app: CallApplicationService;

  constructor(application: CallApplicationService) {
    this.app = application;
  }

  createCall(req: Request, res: Response) {
    try {
      const { clientId, agentId, date, duration, reason, status } = req.body;

      if (!Number.isInteger(clientId) || clientId <= 0)
        return res.status(400).json({ error: "ID de cliente inválido" });

      if (!Number.isInteger(agentId) || agentId <= 0)
        return res.status(400).json({ error: "ID de agente inválido" });

      if (isNaN(Date.parse(date)))
        return res.status(400).json({ error: "Fecha inválida" });

      if (!Number.isInteger(duration) || duration <= 0)
        return res.status(400).json({ error: "Duración inválida" });

      if (typeof reason !== "string" || reason.trim().length < 5)
        return res.status(400).json({ error: "Razón inválida" });

      if (!Number.isInteger(status) || status < 0 || status > 2)
        return res.status(400).json({ error: "Estado no válido" });

      const call: Omit<Call, "id"> = {
        clientId,
        agentId,
        date,
        duration,
        reason,
        status,
      };
      const callId = this.app.createCall(call);
      return res
        .status(201)
        .json({ message: "Llamada creada con éxito", callId });
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

  async getCallById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

      const call = await this.app.getCallById(id);
      if (!call)
        return res.status(404).json({ error: "Llamada no encontrada" });

      return res.status(200).json(call);
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

  async getAllCalls(req: Request, res: Response): Promise<Response> {
    try {
      const calls = await this.app.getAllCalls();
      return res.status(200).json(calls);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error al obtener usuarios", error });
    }
  }

  async updateCall(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      console.log("id", id);
      if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

      const { clientId, agentId, date, duration, reason, status } = req.body;

      if (duration && isNaN(duration))
        return res.status(400).json({ error: "Duración inválida" });

      if (reason && reason.trim().length < 5)
        return res
          .status(400)
          .json({ error: "Razón debe tener al menos 5 caracteres" });
          
      const updated = this.app.updateCall(id, {
        clientId,
        agentId,
        date,
        duration,
        reason,
        status,
      });
      if (!updated)
        return res
          .status(404)
          .json({ error: "Llamada no encontrada o sin cambios" });

      return res.status(200).json({ message: "Llamada actualizada con éxito" });
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

  async deleteCall(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

      const deleted = await this.app.deleteCall(id);
      if (!deleted)
        return res.status(404).json({ error: "Llamada no encontrado" });

      return res.status(200).json({ message: "Llamada eliminada con éxito" });
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

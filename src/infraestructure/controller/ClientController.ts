import { Request, Response } from "express";
import { Client } from "../../domain/entities/Client";
import { ClientApplicationService } from "../../application/ClientApplicationService";

export class ClientController {
  private app: ClientApplicationService;

  constructor(application: ClientApplicationService) {
    this.app = application;
  }

  createClient(req: Request, res: Response) {
    try {
      const { name, phone, email, status } = req.body;

      console.log("Status: ", status);

      if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(name))
        return res.status(400).json({ error: "Nombre inválido" });

      if (!/^\+?[0-9]{7,15}$/.test(phone))
        return res.status(400).json({ error: "Número de teléfono inválido" });

      if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email))
        return res.status(400).json({ error: "Correo electrónico inválido" });

      const client: Omit<Client, "id"> = { name, phone, email, status };
      const clientId = this.app.createClient(client);
      return res
        .status(201)
        .json({ message: "Cliente creado con éxito", clientId });
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

  async getClientById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

      const client = await this.app.getClientById(id);
      if (!client)
        return res.status(404).json({ error: "Usuario no encontrado" });

      return res.status(200).json(client);
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

  async getClientByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        throw new Error("Correo electrónico no válido.");

      const client = await this.app.getClientByEmail(email);

      if (!client) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }

      return res.status(200).json(client);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getAllClients(req: Request, res: Response): Promise<Response> {
    try {
      const clients = await this.app.getAllClients();
      return res.status(200).json(clients);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error al obtener usuarios", error });
    }
  }

  async updateClient(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

      const { name, phone, email, status } = req.body;

      if (name && !/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(name.trim()))
        return res.status(400).json({ error: "Nombre inválido" });

      if (phone && !/^\d{10}$/.test(phone.trim()))
        return res.status(400).json({ error: "Número de teléfono inválido" });

      if (email && !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email))
        return res.status(400).json({ error: "Correo electrónico no válido" });

      const updated = this.app.updateClient(id, { name, phone, email, status });
      if (!updated)
        return res
          .status(404)
          .json({ error: "Cliente no encontrado o sin cambios" });

      return res.status(200).json({ message: "Cliente actualizado con éxito" });
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

  async deleteClient(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

      const deleted = await this.app.deleteClient(id);
      if (!deleted)
        return res.status(404).json({ error: "Cliente no encontrado" });

      return res.status(200).json({ message: "Cliente eliminado con éxito" });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: "Error interno del servidor",
          details: error.message,
        });
      }
      return res.status(500).json({ error: "Cliente interno del servidor" });
    }
  }
}

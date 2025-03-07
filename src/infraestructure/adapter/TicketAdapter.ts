import { Repository } from "typeorm";
import { TicketPort } from "../../domain/ports/TicketPort";
import { Ticket as TicketDomain } from "../../domain/entities/Ticket";
import { Ticket as TicketEntity } from "../entities/Ticket";
import { AppDataSource } from "../config/data_base";
import { Client } from "../entities/Client";
import { Call } from "../entities/Call";

export class TicketAdapter implements TicketPort {
  private ticketRepository: Repository<TicketEntity>;

  constructor() {
    this.ticketRepository = AppDataSource.getRepository(TicketEntity);
  }

  private toDomain(ticket: TicketEntity): TicketDomain {
    return {
      id: ticket.id_ticket,
      callId: ticket.call_ticket.id_call,
      clientId: ticket.client_ticket.id_client,
      description: ticket.description_ticket,
      priority: ticket.priority_ticket,
      status: ticket.status_ticket,
    };
  }

  private toEntity(ticket: Omit<TicketDomain, "id">): TicketEntity {
    const ticketEntity = new TicketEntity();

    ticketEntity.call_ticket = new Call();
    ticketEntity.call_ticket.id_call = ticket.callId;

    ticketEntity.client_ticket = new Client();
    ticketEntity.client_ticket.id_client = ticket.clientId;

    ticketEntity.description_ticket = ticket.description;
    ticketEntity.priority_ticket = ticket.priority;
    ticketEntity.status_ticket = ticket.status;

    return ticketEntity;
  }

  async createTicket(ticket: Omit<TicketDomain, "id">): Promise<number> {
    try {
      const newTicket = this.toEntity(ticket);
      const savedTicket = await this.ticketRepository.save(newTicket);
      return savedTicket.id_ticket;
    } catch (error) {
      console.error("Error al crear el ticket", error);
      throw new Error("Error al crear el ticket");
    }
  }

  async getTicketById(id: number): Promise<TicketDomain | null> {
    try {
      const ticket = await this.ticketRepository.findOne({
        where: { id_ticket: id },
        relations: ["call_ticket", "client_ticket"], // Carga las relaciones automáticamente
      });

      return ticket ? this.toDomain(ticket) : null;
    } catch (error) {
      console.error("Error al buscar el id del ticket:", error);
      throw new Error("Error al buscar el ticket");
    }
  }

  async getAllTickets(): Promise<TicketDomain[]> {
    try {
      const allTickets = await this.ticketRepository.find({
        relations: ["call_ticket", "client_ticket"],
      });

      return allTickets.map(this.toDomain);
    } catch (error) {
      console.error("Error en datos:", error);
      throw new Error("Error al buscar tickets");
    }
  }

  async updateTicket(
    id: number,
    ticket: Partial<TicketDomain>
  ): Promise<boolean> {
    try {
      const existTicket = await this.ticketRepository.findOne({
        where: { id_ticket: id },
      });
      if (!existTicket) return false;

      // Actualizar solo los campos enviados
      Object.assign(existTicket, {
        call_ticket: ticket.callId ?? existTicket.call_ticket,
        client_ticket: ticket.clientId ?? existTicket.client_ticket,
        description_ticket:
          ticket.description ?? existTicket.description_ticket,
        priority_ticket: ticket.priority ?? existTicket.priority_ticket,
        status_ticket: ticket.status ?? existTicket.status_ticket,
      });

      await this.ticketRepository.save(existTicket);
      return true;
    } catch (error) {
      console.error("Error al actualizar el ticket:", error);
      throw new Error("Error al actualizar los datos del ticket");
    }
  }

  async deleteTicket(id: number): Promise<boolean> {
    try {
      const existTicket = await this.ticketRepository.findOne({
        where: { id_ticket: id },
      });
      if (!existTicket) return false;

      // Solo actualizar el estado a 0 (dado de baja)
      Object.assign(existTicket, {
        status_ticket: 0,
      });

      await this.ticketRepository.save(existTicket);
      return true;
    } catch (error) {
      console.error("Error al eliminar el ticket:", error);
      throw new Error("Error al dar de baja el ticket");
    }
  }
}

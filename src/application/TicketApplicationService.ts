import { Ticket } from "../domain/entities/Ticket";
import { TicketPort } from "../domain/ports/TicketPort";

export class TicketApplicationService{
    
    private port: TicketPort;

    constructor(port: TicketPort) {
      this.port = port;
    }
    
    async createTicket(ticket: Omit<Ticket, "id">): Promise<number> { 
      return this.port.createTicket(ticket);
    }

    async getTicketById(id: number): Promise<Ticket | null> {
      return await this.port.getTicketById(id);
    }

    async getAllTickets(): Promise<Ticket[]> {
      return await this.port.getAllTickets();
    }

    async updateTicket(id: number, ticket: Partial<Ticket>): Promise<boolean> {
      const existingTicket = await this.port.getTicketById(id);
      if (!existingTicket) {
        throw new Error("Usuario no encontrado");
      }
      return this.port.updateTicket(id, ticket);
    }
  
    async deleteTicket(id: number): Promise<boolean> {
      return await this.port.deleteTicket(id);
    }  

}
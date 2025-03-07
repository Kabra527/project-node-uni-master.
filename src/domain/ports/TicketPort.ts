import { Ticket } from "../entities/Ticket";

export interface TicketPort{
    createTicket(ticket: Omit<Ticket, "id">): Promise<number>;
    getTicketById(id:number): Promise<Ticket | null>;
    getAllTickets(): Promise<Ticket[]>;
    updateTicket(id: number, ticket: Partial<Ticket>): Promise<boolean>;
    deleteTicket(id:number): Promise<boolean>;
}
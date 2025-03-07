import { Client } from "../domain/entities/Client";
import { ClientPort } from "../domain/ports/ClientPort";

export class ClientApplicationService{
    
    private port: ClientPort;

    constructor(port: ClientPort) {
      this.port = port;
    }
    
    async createClient(client: Omit<Client, "id">): Promise<number> {
      const existingClient = await this.port.getClientByEmail(client.email);
      if (existingClient) {
        throw new Error("El email ya está registrado");
      }  
      return this.port.createClient(client);
    }

    async getClientById(id: number): Promise<Client | null> {
      return await this.port.getClientById(id);
    }

    async getClientByEmail(email: string): Promise<Client | null> {
      return await this.port.getClientByEmail(email);
    }

    async getAllClients(): Promise<Client[]> {
      return await this.port.getAllClients();
    }

    async updateClient(id: number, client: Partial<Client>): Promise<boolean> {
      const existingClient = await this.port.getClientById(id);
      if (!existingClient) {
        throw new Error("Usuario no encontrado");
      }
      if (client.email) {
        const emailTaken = await this.port.getClientByEmail(client.email);
        if (emailTaken && emailTaken.id !== id) {
          throw new Error("El email ya está en uso");
        }
      }
      return this.port.updateClient(id, client);
    }
  
    async deleteClient(id: number): Promise<boolean> {
      return await this.port.deleteClient(id);
    }  

}
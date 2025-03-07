import { Repository } from "typeorm";
import { AppDataSource } from "../config/data_base";
import { ClientPort } from "../../domain/ports/ClientPort";
import { Client as ClientDomain } from "../../domain/entities/Client";
import { Client as ClientEntity } from "../entities/Client";

export class ClientAdapter implements ClientPort {
  private clientRepository: Repository<ClientEntity>;

  constructor() {
    this.clientRepository = AppDataSource.getRepository(ClientEntity);
  }

  private toDomain(client: ClientEntity): ClientDomain {
    return {
      id: client.id_client,
      name: client.name_client,
      email: client.email_client,
      phone: client.phone_client,
      status: client.status_client,
    };
  }

  private toEntity(client: Omit<ClientDomain, "id">): ClientEntity {
    const clientEntity = new ClientEntity();
    clientEntity.name_client = client.name;
    clientEntity.email_client = client.email;
    clientEntity.phone_client = client.phone;
    clientEntity.status_client = client.status;
    return clientEntity;
  }

  async createClient(client: Omit<ClientDomain, "id">): Promise<number> {
    try {
      const newClient = this.toEntity(client);
      const savedClient = await this.clientRepository.save(newClient);
      return savedClient.id_client;
    } catch (error) {
      console.error("Error al crear el cliente", error);
      throw new Error("Error al crear el cliente");
    }
  }

  async getClientById(id: number): Promise<ClientDomain | null> {
    try {
      const client = await this.clientRepository.findOne({ where: { id_client: id }});
      return client ? this.toDomain(client) : null;
    } catch (error) {
      console.error("Error al buscar el id del cliente:", error);
      throw new Error("Error al buscar el cliente");
    }
  }

  async getClientByEmail(email: string): Promise<ClientDomain | null> {
    try {
      const user = await this.clientRepository.findOne({where: {email_client:email}});
      return user ? this.toDomain(user): null;
    } catch (error) {
      console.error("Error al buscar el email del cliente:",error);
      throw new Error("Error al buscar por email");
    }
  }

  async getAllClients(): Promise<ClientDomain[]> {
    try {
      const allClients = await this.clientRepository.find();
      return allClients.map(this.toDomain);
    } catch (error) {
      console.error("Error en datos:", error);
      throw new Error("Error al buscar clientes");
    }
  }

  async updateClient(id: number, Client: Partial<ClientDomain>): Promise<boolean> {
    try {
      const existClient = await this.clientRepository.findOne({where: { id_client: id }});
      if (!existClient) return false;
      Object.assign(existClient, {
        name_client: Client.name ?? existClient.name_client,
        email_client: Client.email ?? existClient.email_client,
        phone_client: Client.phone ?? existClient.phone_client,
        status_client: Client.status ?? existClient.status_client,
      });
      await this.clientRepository.save(existClient);
      return true;
    } catch (error) {
      console.error("Error en datos:", error);
      throw new Error("Error al actualizar los datos del cliente");
    }
  }

  async deleteClient(id: number): Promise<boolean> {
    try {
      const existClient = await this.clientRepository.findOne({where: { id_client: id }});
      if (!existClient) return false;
      
      Object.assign(existClient, {
        status_client: 0,
      });

      await this.clientRepository.save(existClient);
      return true;
    } catch (error) {
      console.error("Error en datos:", error);
      throw new Error("Error al dar de baja el cliente");
    }
  }
}

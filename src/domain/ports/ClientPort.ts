import { Client } from "../entities/Client";

export interface ClientPort{
    createClient(client: Omit<Client, "id">): Promise<number>;
    getClientById(id:number): Promise<Client | null>;
    getClientByEmail(email:string): Promise<Client | null>;
    getAllClients(): Promise<Client[]>;//Arreglo de objetos de tipo client
    updateClient(id: number, client: Partial<Client>): Promise<boolean>;
    deleteClient(id:number): Promise<boolean>;
}
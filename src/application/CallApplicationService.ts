import { Call } from "../domain/entities/Call";
import { CallPort } from "../domain/ports/CallPort";

export class CallApplicationService {
  private port: CallPort;

  constructor(port: CallPort) {
    this.port = port;
  }

  async createCall(call: Omit<Call, "id">): Promise<number> {
    return this.port.createCall(call);
  }

  async getCallById(id: number): Promise<Call | null> {
    return await this.port.getCallById(id);
  }

  async getAllCalls(): Promise<Call[]> {
    return await this.port.getAllCalls();
  }

  async updateCall(id: number, call: Partial<Call>): Promise<boolean> {
    const existingCall = await this.port.getCallById(id);
    if (!existingCall) {
      throw new Error("Usuario no encontrado");
    }

    return this.port.updateCall(id, call);
  }

  async deleteCall(id: number): Promise<boolean> {
    return await this.port.deleteCall(id);
  }
}
import { Call } from "../entities/Call";

export interface CallPort{
    createCall(call: Omit<Call, "id">): Promise<number>;
    getCallById(id:number): Promise<Call | null>;
    getAllCalls(): Promise<Call[]>;
    updateCall(id: number, call: Partial<Call>): Promise<boolean>;
    deleteCall(id:number): Promise<boolean>;
}
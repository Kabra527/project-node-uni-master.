import { Timestamp } from "typeorm";

export interface Call {
    id: number;
    clientId: number;
    agentId: number;
    date: Timestamp;
    duration: number;
    reason: string;
    status: number;
}
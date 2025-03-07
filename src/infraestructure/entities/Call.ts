import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, Timestamp} from "typeorm";
import { Client } from "./Client";
import { User } from "./User";
import { Ticket } from "./Ticket";

export enum CallStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

@Entity()
export class Call {
  @PrimaryGeneratedColumn()
  id_call!: number;

  @ManyToOne(() => Client, (client) => client.calls, { onDelete: "CASCADE" })
  @JoinColumn({ name: "id_client" })
  client_call!: Client;

  @ManyToOne(() => User, (user) => user.calls, { onDelete: "CASCADE" })
  @JoinColumn({ name: "id_user" })
  agent_call!: User;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  date_call!: Timestamp;

  @Column({ type: "int" })
  duration_call!: number;

  @Column({ type: "text" })
  reason_call!: string;

  @Column({ type: "int" })
  status_call!: number;

  @OneToMany(() => Ticket, (ticket) => ticket.client_ticket)
  tickets!: Ticket[];
}


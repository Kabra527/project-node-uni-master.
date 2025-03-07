import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./Client";
import { Call } from "./Call";


@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id_ticket!: number;

  @ManyToOne(() => Call, (call) => call.tickets, { onDelete: "CASCADE" })
  @JoinColumn({ name: "id_call" })
  call_ticket!: Call;

  @ManyToOne(() => Client, (client) => client.tickets, { onDelete: "CASCADE" })
  @JoinColumn({ name: "id_client" })
  client_ticket!: Client;

  @Column({ type: "varchar", length: 255, unique: true })
  description_ticket!: string;

  @Column({ type: "varchar", length: 255 })
  priority_ticket!: string;

  @Column({ type: "int" })
  status_ticket!: number;
  
}
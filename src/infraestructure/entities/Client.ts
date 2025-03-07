import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Call } from "./Call";
import { Ticket } from "./Ticket";


@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id_client!: number;

  @Column({ type: "varchar", length: 255 })
  name_client!: string;

  @Column({ type: "varchar", length: 20 })
  phone_client!: string;

  @Column({ type: "varchar", length: 255 })
  email_client!: string;

  @Column({ type: "int" })
  status_client!: number;

  @OneToMany(() => Call, (call) => call.client_call)
  calls!: Call[];

  @OneToMany(() => Ticket, (ticket) => ticket.client_ticket)
  tickets!: Ticket[];
}

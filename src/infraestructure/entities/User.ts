import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Call } from "./Call";


@Entity()
export class User{

    @PrimaryGeneratedColumn()
    id_user!:number;

    @Column({type:"varchar", length: 255})
    name_user!: string;

    @Column({type:"varchar", length: 255, unique: true})
    email_user!: string;

    @Column({type:"varchar", length: 255})
    password_user!: string;

    @Column({type: "varchar", length: 50})
    role_user!  : string;

    @Column({type: "int"})
    status_user!: number;

    @OneToMany(() => Call, (call) => call.client_call)
    calls!: Call[];

}
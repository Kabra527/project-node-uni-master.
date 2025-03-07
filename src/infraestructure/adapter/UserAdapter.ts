import { Repository } from "typeorm";
import { AppDataSource } from "../config/data_base";
import { UserPort } from "../../domain/ports/UserPort";
import { User as UserDomain } from "../../domain/entities/User";
import { User as UserEntity } from "../entities/User";



export class UserAdapter implements UserPort{
    private userRepository: Repository<UserEntity>;

    constructor(){
        this.userRepository = AppDataSource.getRepository(UserEntity);
    }
    //Transforma la entidad al modelo de dominio(interface User.ts)
    private toDomain(user: UserEntity): UserDomain{
        return {
            id: user.id_user,
            name: user.name_user,
            email: user.email_user,
            password: user.password_user,
            role: user.role_user,
            status: user.status_user
        }
    }
    //Transforma el modelo de dominio en la entidad de infraestructura
    private toEntity(user: Omit<UserDomain,"id">): UserEntity{
        const userEntity = new UserEntity();
        userEntity.name_user = user.name;
        userEntity.email_user = user.email;
        userEntity.password_user = user.password;
        userEntity.role_user = user.role;
        userEntity.status_user = user.status;
        return userEntity;
    }
    //Crear un nuevo usuario
    async createUser(user: Omit<UserDomain, "id">): Promise<number> {
        try{
            const newUser = this.toEntity(user);
            const saveUser = await this.userRepository.save(newUser);   
            return saveUser.id_user;
        }catch (error){
            console.error("Error al crear el usuario",error);
            throw new Error("Error al crear el usuario");
        }
    }

    async getUserById(id: number): Promise<UserDomain | null> {
        try {
            const user = await this.userRepository.findOne({where: {id_user:id}});
            return user ? this.toDomain(user): null;
        } catch (error) {
            console.error("Error al buscar el id del usuario:",error);
            throw new Error("Error al buscar el usuario");
        }
    }

    async getUserByEmail(email: string): Promise<UserDomain | null> {
        try {
            const user = await this.userRepository.findOne({where: {email_user:email}});
            return user ? this.toDomain(user): null;
        } catch (error) {
            console.error("Error al buscar el email del usuario:",error);
            throw new Error("Error al buscar por email");
        }
    }

    async getAllUsers(): Promise<UserDomain[]> {
        try {
            const allUsers = await this.userRepository.find();
            return allUsers.map(this.toDomain);  
        } catch (error) {
            console.error("Error en datos:",error);
            throw new Error("Error al buscar usuarios");
        }
    }

    async updateUser(id: number, user: Partial<UserDomain>): Promise<boolean> {
        try {
            const existUser = await this.userRepository.findOne({where: {id_user:id}});
            if(!existUser) return false;
            //Busqueda de email sino existe, si mandaron un email diferente para actualizar hay que verificar que no exista
            //actualizo solo los campos enviados
            Object.assign(existUser,{
                name_user: user.name ?? existUser.name_user,
                email_user: user.email ?? existUser.email_user,
                password_user: user.password ?? existUser.password_user,
                status_user: user.status ?? existUser.status_user
            });
            await this.userRepository.save(existUser);
            return true;
        } catch (error) {
            console.error("Error en datos:",error);
            throw new Error("Error al actualizar los datos del usuario");
        }
    }

    async deleteUser(id: number): Promise<boolean> {
        try {
            const existUser = await this.userRepository.findOne({where: {id_user:id}});
            if(!existUser) return false;
            //Actualizamos solo el estatus a 0 que es dado de baja
            Object.assign(existUser,{
                status_user:0
            });
            await this.userRepository.save(existUser);
            return true;
            
        } catch (error) {
            console.error("Error en datos:",error);
            throw new Error("Error al dar de baja el usuario");    
        }
    }
    
}

import { Request, Response } from "express";
import { UserApplicationService } from "../../application/UserApplicationService";
import { User } from "../../domain/entities/User";

export class UserController{

    private app: UserApplicationService;

    constructor(application: UserApplicationService){
        this.app = application;
    }

    createUser(req: Request, res: Response){
      try {
        
        const { name, email, password, role, status } = req.body;
        
        // Validaciones antes de crear
        if (
          !/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)?$/.test(
            name.trim()
          )
        )
          return res.status(400).json({
            error: "Error en el nombre solo debe contener letras",
          });
        if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email))
          return res.status(400).json({
            error: "Error en el correo electrónico",
          });
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password))
          return res.status(400).json({
            error:
              "Error en la contraseña, al menos debe tener 6 caracteres, una letra y un número",
          });
        // Validación del rol
        const rolesPermitidos = ["agente", "supervisor", "administrador"];
        if (!rolesPermitidos.includes(role.trim().toLowerCase())) {
          return res.status(400).json({
            error:
              "Error en el rol, debe ser 'agente', 'supervisor' o 'administrador'",
          });
        }
        //crear usuario
        const user: Omit<User, "id"> = { name, email, password, role, status };
        const userId = this.app.createUser(user);
        return res
          .status(201)
          .json({ message: "Usario creado con éxito", userId });
      } catch (error) {
          if(error instanceof Error) {
              return res.status(500)
              .json({
                  error: "Error interno en el Servidor",
                  details: error.message
              })
          }
          return res
            .status(500)
            .json({error: "Error interno del servidor"});
      }
    }

    async getUserById(req: Request, res: Response) {
      try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });
  
        const user = await this.app.getUserById(id);
        if (!user)
          return res.status(404).json({ error: "Usuario no encontrado" });
  
        return res.status(200).json(user);
      } catch (error) {
        if (error instanceof Error) {
          return res
            .status(500)
            .json({
              error: "Error interno del servidor",
              details: error.message,
            });
        }
        return res.status(500).json({ error: "Error interno del servidor" });
      }
    }

    async getUserByEmail(req: Request, res: Response) {
      try {
        const { email } = req.params;
  
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
          throw new Error("Correo electrónico no válido.");
  
        const user = await this.app.getUserByEmail(email);
  
        if (!user) {
          return res.status(404).json({ message: "Usuario no encontrado" });
        }
  
        return res.status(200).json(user);
      } catch (error) {
        if (error instanceof Error) {
          return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: "Error interno del servidor" });
      }
    }

    async getAllUsers(req: Request, res: Response): Promise<Response> {
      try {
          const users = await this.app.getAllUsers();
          return res.status(200).json(users);
      } catch (error) {
          return res.status(500).json({ message: "Error al obtener usuarios", error });
      }
    }

    async updateUser(req: Request, res: Response) {
      try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        const { name, email, password, role, status } = req.body;

        // Validaciones antes de actualizar
        if (name && !/^[a-zA-Z\s]{3,}$/.test(name.trim()))
          return res.status(400).json({
            error:
              "El nombre debe tener al menos 3 caracteres y solo contener letras",
          });

        if (email && !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email))
          return res
            .status(400)
            .json({ error: "Correo electrónico no válido" });

        if (
          password &&
          !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)
        )
          return res.status(400).json({
            error:
              "La contraseña debe tener al menos 6 caracteres, incluyendo al menos una letra y un número",
          });
        const rolesPermitidos = ["agente", "supervisor", "administrador"];
        if (!rolesPermitidos.includes(role.trim().toLowerCase())) {
          return res.status(400).json({
            error:
              "Error en el rol, debe ser 'agente', 'supervisor' o 'administrador'",
          });
        }
        if (status !== undefined && ![0, 1].includes(status))
          return res
            .status(400)
            .json({ error: "El estado debe ser 0 (inactivo) o 1 (activo)" });

        const updated = await this.app.updateUser(id, {
          name,
          email,
          password,
          status,
        });
        if (!updated)
          return res
            .status(404)
            .json({ error: "Usuario no encontrado o sin cambios" });

        return res
          .status(200)
          .json({ message: "Usuario actualizado con éxito" });
      } catch (error) {
        if (error instanceof Error) {
          return res
            .status(500)
            .json({
              error: "Error interno del servidor",
              details: error.message,
            });
        }
        return res.status(500).json({ error: "Error interno del servidor" });
      }
    }

    async deleteUser(req: Request, res: Response) {
      try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });
  
        const deleted = await this.app.deleteUser(id);
        if (!deleted)
          return res.status(404).json({ error: "Usuario no encontrado" });
  
        return res.status(200).json({ message: "Usuario eliminado con éxito" });
      } catch (error) {
        if (error instanceof Error) {
          return res
            .status(500)
            .json({
              error: "Error interno del servidor",
              details: error.message,
            });
        }
        return res.status(500).json({ error: "Error interno del servidor" });
      }
    }
    
}
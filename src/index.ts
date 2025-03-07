import "./infraestructure/config/environment-vars";
import app from "./infraestructure/web/app";
import { ServerBootstrap } from "./infraestructure/bootstrap/server.bootstrap";
import {connectDB } from "./infraestructure/config/data_base";

const serverBooststrap = new ServerBootstrap(app);

/**Función auto invocada */
(async ()=>{
    try{
        await connectDB(); //Conectar a la BD antes de Inicializar el servidor
        const instances = [serverBooststrap.initialize()];
        await Promise.all(instances);
    }catch (error){
        console.error(error);
        process.exit(1);
    }
})();
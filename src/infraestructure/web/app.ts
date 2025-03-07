//Proentar a Objetos
import express, {Request, Response} from "express";
import routes from "../routes/Routes";
class App{

    private app: express.Application;

    constructor(){
        this.app = express();
        this.middlewares();
        this.routes();
    }

    private middlewares():void{
        this.app.use(express.json());
    }

    private routes():void{
        this.app.use("/api", routes);
    }

    getApp(){
        return this.app;
    }
    
}

export default new App().getApp();


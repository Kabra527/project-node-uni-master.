import express from "express";
import http from "http";
import envs from "../config/environment-vars";

export class ServerBootstrap {
  private app: express.Application;

  constructor(app: express.Application) {
    this.app = app;
  }

  initialize(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        const server = http.createServer(this.app);
        const PORT = envs.PORT || 4000;
        server
        .listen(PORT)
        .on("listening", () => {
            console.log(`Server is running on port ${PORT}`);
            resolve(true);
        })
        .on("error", (err) => {
            console.log(`Server isn´t running ${err} `);
            reject(false);
        });
    });
  }
  
}

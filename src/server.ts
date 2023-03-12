import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import errorMiddleware from "./middlewares/errorMiddleware";
import { authRoutes } from "./routes/authRoutes";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { config } from "dotenv";

config(); // Load environment variables from .env file

class Server {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.handleError();
    this.setupSwagger();
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  private routes(): void {
    this.app.use("/api/auth", authRoutes);
  }

  private handleError(): void {
    this.app.use(errorMiddleware);
  }

  private setupSwagger(): void {
    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Medical Departures Blog API',
          version: '1.0.0',
        },
      },
      apis: ['./src/routes/*.ts'],
    };
    const specs = swaggerJsdoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }
}

const server = new Server().app;

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

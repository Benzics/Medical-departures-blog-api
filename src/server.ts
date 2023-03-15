import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import errorMiddleware from "./middlewares/errorMiddleware";
import { authRoutes } from "./routes/authRoutes";
import { postRoutes } from "./routes/postRoutes";
import { indexRoute } from "./routes";
import { commentRoutes } from "./routes/commentRoutes";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import awsServerlessExpress from 'aws-serverless-express';


class Server {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.handleError();
    this.setupSwagger();
  }

  private async config() {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  private routes(): void {
    this.app.use("/", indexRoute);
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/posts", postRoutes);
    this.app.use("/api/comments", commentRoutes);
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
    this.app.use('/api-docs', swaggerUi.serveWithOptions({ redirect: false }), swaggerUi.setup(specs));
  }
}

const server = new Server().app;
const binaryMimeTypes = [
  'application/json',
  'application/octet-stream',
  'image/jpeg',
  'image/png',
  'image/gif'
];
const serverless = awsServerlessExpress.createServer(server, undefined, binaryMimeTypes);

exports.handler = (event: any, context: any) => {
  awsServerlessExpress.proxy(serverless, event, context);
};

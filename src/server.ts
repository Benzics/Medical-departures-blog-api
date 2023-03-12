import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import errorMiddleware from "./middlewares/errorMiddleware";
import { authRoutes } from "./routes/authRoutes";
// import { userRoutes } from "./routes/userRoutes";
// import { postRoutes } from "./routes/postRoutes";
import { config } from "dotenv";

config(); // Load environment variables from .env file

class Server {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.handleError();
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  private routes(): void {
    this.app.use("/api/auth", authRoutes);
    // this.app.use("/api/users", userRoutes);
    // this.app.use("/api/posts", postRoutes);
  }

  private handleError(): void {
    this.app.use(errorMiddleware);
  }
}

const server = new Server().app;

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

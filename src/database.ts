import { Sequelize } from "sequelize";
import { config } from "dotenv";

config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    dialect: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
  }
);

export { sequelize };

import mysql from 'mysql2/promise';
import {config} from 'dotenv';

config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'your-mysql-username',
  password: process.env.DB_PASSWORD || 'your-mysql-password',
  database: process.env.DB_NAME || 'your-database-name',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default {
  async query(sql: string, values?: any[]): Promise<any> {
    const connection = await pool.getConnection();
    try {
      const [rows, fields] = await connection.query(sql, values);
      return rows;
    } catch (error) {
      console.error(error);
    } finally {
      connection.release();
    }
  },
};

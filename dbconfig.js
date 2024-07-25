import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbPassword = process.env.DB_PASSWORD;
const dbUser = process.env.DB_USER;

const pool = mysql.createPool({
  host: 'split-mate-database.cfigouq008fn.us-west-2.rds.amazonaws.com',
  user: dbUser,
  password: dbPassword,
  database: 'board',
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0 // 等待連線請求數，0 表示不限制
});

// 使用連接池查詢
export class Database {
  static async executeQuery(query, params = []) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [results] = await connection.execute(query, params);

      // SELECT 查詢
      if (query.trim().toLowerCase().startsWith("select")) {
        return results;
      } else {
        // 非 SELECT 查詢
        return {
          affectedRows: results.affectedRows,
          insertId: results.insertId
        };
      }
    } catch (error) {
      console.error('Error while connecting to MySQL', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }
}

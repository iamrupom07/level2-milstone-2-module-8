import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import dotenv from "dotenv";
import config from "./config";
import { pool } from "./db";
import type { Result } from "pg";

dotenv.config();

const app: Application = express();
const port = config.port;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello World!",
    author: "Rupom",
  });
});

app.post("/api/users", async (req: Request, res: Response) => {
  const { name, email, password, age } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users(name,email,password,age) VALUES($1,$2,$3,$4)
    RETURNING *
    `,

      [name, email, password, age],
    );
    console.log(result);

    res.status(201).json({
      message: "User Created Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
});

app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result: Result = await pool.query(`SELECT * FROM users`);
    res.status(200).json({
      success: true,
      message: "Users Fetched Successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
});

app.get("/api/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result: Result = await pool.query(`SELECT * FROM users WHERE id=$1`, [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User Fetched Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
});

app.put("/api/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, password, age, is_active } = req.body;

  try {
    const result: Result = await pool.query(
      `UPDATE users 
      SET 
      name=COALESCE($1,name),
      password=COALESCE($2,password),
      age=COALESCE($3,age),
      is_active=COALESCE($4,is_active) 
      WHERE id=$5 RETURNING *`,
      [name, password, age, is_active, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User Updated Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
});

app.delete("/api/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result: Result = await pool.query(`DELETE FROM users WHERE id=$1`, [
      id,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
});

export default app;

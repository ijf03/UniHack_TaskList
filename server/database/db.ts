import sqlite3 from "sqlite3";
import { open } from "sqlite";

// This creates a database connection that will be reused
export async function getDb() {
  // Open a database connection (creates the file if it doesn't exist)
  const db = await open({
    filename: "./server/database/tasks.db", // Database file location
    driver: sqlite3.Database, // SQLite database driver
  });

  // Create tasks table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      task_id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_title TEXT NOT NULL,
      task_deadline TEXT NOT NULL,
      task_completed BOOLEAN NOT NULL DEFAULT 0,
      task_reminder_sent BOOLEAN NOT NULL DEFAULT 0
    )
  `);

  return db;
}

// Initialize the database when the server starts
export async function initializeDb() {
  const db = await getDb();
  console.log("Database initialized successfully");
  return db;
}

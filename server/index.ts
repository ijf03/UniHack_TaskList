import express, { Request, Response, RequestHandler } from "express";
import cors from "cors";
import { initializeDb } from "./database/db";
import cron from "node-cron";

// Constants
const app = express();
const PORT = 3001;

// Middleware
app.use(cors()); // Allow React frontend to communicate with this server
app.use(express.json()); // Parse JSON request bodies

// Database initialization
let db: any;
initializeDb().then((database) => {
  db = database;
  // Setup deadline checker once database is ready
  setupDeadlineChecker();
});

// Function to check for expired tasks
async function checkForExpiredTasks() {
  try {
    console.log("Checking for expired tasks...");
    const now = new Date().toISOString();

    // Find tasks that:
    // 1. Are not completed
    // 2. Have passed their deadline
    // 3. Haven't had a reminder sent yet
    const expiredTasks = await db.all(
      `
      SELECT * FROM tasks 
      WHERE task_completed = 0 
      AND task_deadline < ? 
      AND task_reminder_sent = 0
    `,
      [now]
    );

    if (expiredTasks.length === 0) {
      console.log("No expired tasks found");
      return;
    }

    console.log(`Found ${expiredTasks.length} expired tasks`);

    // Process each expired task
    for (const task of expiredTasks) {
      console.log(
        `DEADLINE EXPIRED: Task "${task.task_title}" was due on ${new Date(task.task_deadline).toLocaleString()}`
      );

      // In the future, this is where you'd send an email
      // For now, just log to console

      // Mark the task as having had a reminder sent
      await db.run(
        `
        UPDATE tasks 
        SET task_reminder_sent = 1 
        WHERE task_id = ?
      `,
        [task.task_id]
      );

      console.log(`Marked task ID ${task.task_id} as reminded`);
    }
  } catch (error) {
    console.error("Error checking for expired tasks:", error);
  }
}

// Setup a scheduled job to run the deadline checker
function setupDeadlineChecker() {
  // Check twice per minute (every 30 seconds)
  cron.schedule("*/30 * * * * *", () => {
    checkForExpiredTasks();
  });

  console.log("Task deadline checker scheduled (runs every 30 seconds)");

  // Also run once on server start to check for any tasks that expired while server was down
  checkForExpiredTasks();
}

// API endpoints
const getTasks: RequestHandler = async (req: Request, res: Response) => {
  try {
    const tasks = await db.all(
      "SELECT * FROM tasks ORDER BY task_deadline ASC"
    );

    // Convert database schema to frontend schema
    const formattedTasks = tasks.map((task: any) => ({
      id: task.task_id,
      title: task.task_title,
      completed: Boolean(task.task_completed),
      deadline: task.task_deadline,
    }));

    res.json(formattedTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to retrieve tasks" });
  }
};

const createTask: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { title, deadline } = req.body;

    // Validate input
    if (!title || !deadline) {
      res.status(400).json({ error: "Title and deadline are required" });
      return;
    }

    // Insert new task
    const result = await db.run(
      "INSERT INTO tasks (task_title, task_deadline, task_completed, task_reminder_sent) VALUES (?, ?, ?, ?)",
      [title, deadline, 0, 0]
    );

    // Return the newly created task
    const newTask = await db.get(
      "SELECT * FROM tasks WHERE task_id = ?",
      result.lastID
    );

    // Format the task for the frontend
    const formattedTask = {
      id: newTask.task_id,
      title: newTask.task_title,
      completed: Boolean(newTask.task_completed),
      deadline: newTask.task_deadline,
    };

    res.status(201).json(formattedTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

const updateTask: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    // Update task completion status
    await db.run("UPDATE tasks SET task_completed = ? WHERE task_id = ?", [
      completed ? 1 : 0,
      id,
    ]);

    // Return updated task
    const updatedTask = await db.get(
      "SELECT * FROM tasks WHERE task_id = ?",
      id
    );

    // Format the task for the frontend
    const formattedTask = {
      id: updatedTask.task_id,
      title: updatedTask.task_title,
      completed: Boolean(updatedTask.task_completed),
      deadline: updatedTask.task_deadline,
    };

    res.json(formattedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
};

const deleteTask: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Delete the task
    await db.run("DELETE FROM tasks WHERE task_id = ?", id);

    res.sendStatus(204); // No content response
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

app.get("/api/tasks", getTasks);
app.post("/api/tasks", createTask);
app.put("/api/tasks/:id", updateTask);
app.delete("/api/tasks/:id", deleteTask);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

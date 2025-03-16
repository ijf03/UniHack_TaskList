import express, { Request, Response, RequestHandler } from "express";
import cors from "cors";
import { initializeDb } from "./database/db";
import cron from "node-cron";
import fetch from "node-fetch";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Constants
const app = express();
const PORT = 3001;
const GROK_API_KEY = process.env.GROK_API_KEY || "";
const BREVO_API_KEY = process.env.BREVO_API_KEY || "";

// Verify Grok API key is available
if (!GROK_API_KEY) {
  console.error("GROK_API_KEY is not defined in environment variables");
  process.exit(1); // Exit if the key is missing
}

// Verify Brevo API key is available
if (!BREVO_API_KEY) {
  console.error("BREVO_API_KEY is not defined in environment variables");
  process.exit(1); // Exit if the key is missing
}

// Middleware
app.use(cors()); // Allow React frontend to communicate with this server
app.use(express.json()); // Parse JSON request bodies

// Function to get berating message from Grok API
async function getBeratingMessage(taskTitle: string): Promise<string> {
  try {
    const url = "https://api.x.ai/v1/chat/completions";

    const payload = {
      messages: [
        {
          role: "system",
          content:
            "You are part of a scheduler application. You berate the user if they do not do a task. Include a lot of swear words. You're going to be given the task that the user did not complete.",
        },
        {
          role: "user",
          content: `I did not do task "${taskTitle}"`,
        },
      ],
      model: "grok-2-latest",
      stream: false,
      temperature: 0,
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROK_API_KEY}`,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as {
      choices: { message: { content: string } }[]; // assert that it's well-formed
    };
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Grok API:", error);
    return "Failed to generate a berating message.";
  }
}

// Function to send an email via Brevo API
async function sendTaskOverdueEmail(
  taskTitle: string,
  beratingMessage: string
): Promise<boolean> {
  try {
    const API_URL = "https://api.brevo.com/v3/smtp/email";

    const emailData = {
      sender: {
        name: "Lock TF In",
        email: "locktfin.tasklist@gmail.com",
      },
      to: [
        {
          email: "hbre0004@student.monash.edu",
          name: "Task Owner",
        },
      ],
      subject: `Task "${taskTitle}" is overdue!`,
      htmlContent: `
        <html>
          <body>
            <div style="padding: 15px; background-color: #f8f8f8; border-left: 5px solid #ff4444; margin: 20px 0;">
              <p>${beratingMessage.replace(/\n/g, "<br>")}</p>
            </div>
          </body>
        </html>
      `,
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Brevo API error:", errorData);
      return false;
    }

    const result = await response.json();
    console.log("Email sent successfully:", result);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

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

      // Get berating message from Grok API
      const beratingMessage = await getBeratingMessage(task.task_title);
      console.log(`Grok says: ${beratingMessage}`);

      // Send email with the berating message
      const emailSent = await sendTaskOverdueEmail(
        task.task_title,
        beratingMessage
      );

      if (emailSent) {
        console.log(`Sent email notification for task "${task.task_title}"`);
      } else {
        console.error(`Failed to send email for task "${task.task_title}"`);
      }

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

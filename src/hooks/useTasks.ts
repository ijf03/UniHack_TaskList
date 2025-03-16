import { useEffect, useState } from "react";
import { Task } from "../types/task";

const API_URL = "http://localhost:3001/api";

export default function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/tasks`);

      if (!response.ok) throw new Error("Failed to fetch tasks");

      const data = await response.json();

      // Transform the data - convert deadline strings to Date objects
      const formattedTasks = data.map((task: any) => ({
        ...task,
        deadline: new Date(task.deadline),
      }));

      setTasks(formattedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }

  async function setTaskCompleted(id: number, completed: boolean) {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) throw new Error("Failed to update task");

      // Update local state after successful API call
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, completed } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  async function addTask(title: string, deadline: Date) {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          deadline: deadline.toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to add task");

      const newTask = await response.json();

      // Convert deadline string back to Date object
      const formattedTask = {
        ...newTask,
        deadline: new Date(newTask.deadline),
      };

      // Update local state with the newly created task
      setTasks((prevTasks) => [formattedTask, ...prevTasks]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

  async function deleteTask(id: number) {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete task");

      // Remove task from local state after successful API call
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  function deleteAllCompleted() {
    // This would require a new API endpoint or multiple API calls
    // For now, let's delete completed tasks one by one
    tasks.forEach((task) => {
      if (task.completed) {
        deleteTask(task.id);
      }
    });
  }

  return {
    tasks,
    loading,
    setTaskCompleted,
    addTask,
    deleteTask,
    deleteAllCompleted,
  };
}

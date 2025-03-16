import { useState } from "react";
import TaskItem from "./TaskListItem";
import TasklistForm from "./TasklistForm";
import { Task } from "../types/task";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  function handleAddTask(title: string, deadline: Date) {
    const newTask: Task = {
      id: tasks.length + 1,
      title,
      completed: false,
      deadline,
    };
    setTasks([...tasks, newTask]);
  }

  function handleCompletedChange(id: number, completed: boolean) {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, completed } : task)),
    );
  }

  function handleDeleteTask(id: number) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }

  const tasksSorted = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) {
      return b.id - a.id;
    }
    return a.completed ? 1 : -1;
  });

  return (
    <div>
      <TasklistForm onSubmit={handleAddTask} />
      <div className="space-y-2">
        {tasksSorted.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onCompletedChange={handleCompletedChange}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>
      {tasks.length === 0 && (
        <p className="text-sm text-gray-500">You're free... for now.</p>
      )}
    </div>
  );
}

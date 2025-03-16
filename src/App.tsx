import "./App.css";
import { useState } from "react";
import TaskList from "./components/TaskList";
import CalendarMonth from "./components/CalendarMonth";
import { Task } from "./types/task";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  function addTask(title: string, deadline: Date) {
    setTasks([...tasks, { id: tasks.length + 1, title, completed: false, deadline }]);
  }

  function updateTaskCompletion(id: number, completed: boolean) {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed } : task))
    );
  }

  function deleteTask(id: number) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  return (
    <div className="flex flex-row">
      <div className="p-4 flex flex-col">
        <h1 className="text-4xl font-bold text-center">Task List</h1>
        <TaskList
          tasks={tasks}
          onAddTask={addTask}
          onUpdateTask={updateTaskCompletion}
          onDeleteTask={deleteTask}
        />
      </div>
      <CalendarMonth tasks={tasks} />
    </div>
  );
}

export default App;

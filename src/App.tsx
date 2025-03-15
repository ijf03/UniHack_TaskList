import React from "react";
import "./App.css";
import AddTaskForm from "./components/TasklistForm";
import TaskList from "./components/TaskList";
import useTasks from "./hooks/useTasks";
import CalendarMonth from "./components/CalendarMonth";

function App() {
  const { tasks, addTask, setTaskCompleted, deleteTask } = useTasks();

  return (
    <>
      <div className="container mx-auto p-4 float-left">
        <AddTaskForm onSubmit={addTask} />
        <TaskList
          tasks={tasks}
          onCompletedChange={setTaskCompleted}
          onDelete={deleteTask}
        />      
      </div>
      <div className="container mx-auto p-4 float-right">
        <CalendarMonth />
      </div>
    </>
  );
}

export default App;


import "./App.css";
import TaskList from "./components/TaskList";
import useTasks from "./hooks/useTasks";
import CalendarMonth from "./components/CalendarMonth";

function App() {
  const { tasks, setTaskCompleted, deleteTask } = useTasks();

  return (
    <>
    <div className="flex flex-row">
      <div className="p-4 flex flex-col">
      <h1 className="text-4xl font-bold text-center">Task List</h1>
    
        <TaskList
          tasks={tasks}
          onCompletedChange={setTaskCompleted}
          onDelete={deleteTask}
        />
      </div>
        <CalendarMonth />
    </div>
    </>
  );
}

export default App;

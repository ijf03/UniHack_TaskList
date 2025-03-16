import "./css/App.css";
import TaskList from "./components/TaskList";
import CalendarMonth from "./components/CalendarMonth";
import useTasks from "./hooks/useTasks";

function App() {
  const { tasks, loading, addTask, setTaskCompleted, deleteTask } = useTasks();

  return (
    <>
      <h1 className="text-4xl font-bold text-center p-4">LOCK TF IN!</h1>
      <div className="flex flex-row">
        <div className="p-4 flex flex-col">
          <h2 className="text-4xl font-bold text-center">Task List</h2>
          {loading ? (
            <p className="text-center p-4">Loading tasks...</p>
          ) : (
            <TaskList
              tasks={tasks}
              onAddTask={addTask}
              onUpdateTask={setTaskCompleted}
              onDeleteTask={deleteTask}
            />
          )}
        </div>
        <CalendarMonth tasks={tasks} />
      </div>
    </>
  );
}

export default App;

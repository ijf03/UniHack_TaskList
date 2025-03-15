import React from 'react'
import './App.css'
import AddTaskForm from './components/TasklistForm'
import TaskList from './components/TaskList'
import useTasks from "./hooks/useTasks";

function App() {

  const {
    tasks,
    addTask,
    setTaskCompleted,
    deleteTask,
  } = useTasks();

  return (
    <>
      <div>
      <AddTaskForm 
          onSubmit={addTask}
        />
        <TaskList
          tasks={tasks}
          onCompletedChange={setTaskCompleted}
          onDelete={deleteTask}>
          
        </TaskList>
      </div>
    
    </>
  )
}

export default App



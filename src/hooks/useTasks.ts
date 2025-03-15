import { useEffect } from "react";
import { Task } from "../types/task";
import { dummyData } from "../data/tasks";
import { useState } from "react";

export default function useTasks() {
    const [tasks, setTasks] = useState(()=> {
        const savedTasks : Task[] = JSON.parse(localStorage.getItem("tasks") || "[]")
        return savedTasks.length > 0 ? savedTasks : dummyData
      })
    
      useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks))
      },[tasks])
    
      function setTaskCompleted(id: number, completed: boolean) {
        setTasks((prevTasks) => 
          prevTasks.map((task) => 
            (task.id === id ? { ...task, completed } : task)))
        }


        function addTask(title: string) {
            setTasks(prevTasks => [
              {
                id: Date.now(),
                title,
                completed: false,
                deadline: new Date(),
              },
              ...prevTasks,
            ])
          }
        
          function deleteTask(id: number) {
            setTasks(prevTasks => prevTasks.filter(task => task.id !==id))
          }
        
          function deleteAllCompleted() {
            setTasks(prevTasks => prevTasks.filter(task => !task.completed))
          }
    
        return {
            tasks,
            setTaskCompleted,
            addTask,
            deleteTask,
            deleteAllCompleted
        }
    }
import { Trash2 } from "lucide-react";
import { Task } from "../types/task"

interface TaskItemProps {
    task: Task
    onCompletedChange: (id: number, completed: boolean) => void;
    onDelete: (id:number) => void;
}

export default function TaskItem({task, onCompletedChange, onDelete}: TaskItemProps) {
    return(
        <div className="flex items-center gap-1">
            <label className="flex items-center gap-2 border roundded-md p-2 border-gray-400 bg-white hover:bg-emerald-500 text-black grow">
                <input
                    type="checkbox" 
                    checked={task.completed} 
                    onChange={(e) => onCompletedChange(task.id, e.target.checked)} 
                    className="scale-125" />
                <span className={task.completed ?"line-through text-gray-400": ""}>
                    {task.title}
                </span>
            </label>
            <button className="p-2" onClick={()=>onDelete(task.id)}>
                <Trash2 size={20} className="text-gray-500"/>
            </button>
        </div>
    )
    
}
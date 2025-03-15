import { Trash2 } from "lucide-react";
import { Task } from "../types/task";

interface TaskItemProps {
  task: Task;
  onCompletedChange: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export default function TaskItem({ task, onCompletedChange, onDelete }: TaskItemProps) {
  return (
    <div className="flex items-center justify-between p-3 border border-gray-400 bg-white rounded-md shadow-sm w-full">
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => onCompletedChange(task.id, e.target.checked)}
            className="scale-125"
          />
          <span className={`flex-grow ${task.completed ? "line-through text-gray-400" : "text-black"}`}>
            {task.title}
          </span>
        </label>
        <p className="text-sm text-gray-500">Deadline: {task.deadline.toDateString()}</p>
      </div>
      <button className="p-2 hover:bg-gray-200 rounded-md" onClick={() => onDelete(task.id)}>
        <Trash2 size={20} className="text-gray-500" />
      </button>
    </div>
  );
}

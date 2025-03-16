import { Trash2 } from "lucide-react";
import { Task } from "../types/task";

interface TaskItemProps {
  task: Task;
  onCompletedChange: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export default function TaskItem({
  task,
  onCompletedChange,
  onDelete,
}: TaskItemProps) {
  // Ensure deadline is a Date object
  const deadline =
    task.deadline instanceof Date ? task.deadline : new Date(task.deadline);

  const now = new Date();
  const isPastDeadline = deadline < now && !task.completed;

  // Determine background color based on task status
  const getBgColor = () => {
    if (task.completed) return "bg-green-50";
    if (isPastDeadline) return "bg-red-50";
    return "bg-white";
  };

  // Text color for the deadline
  const getDeadlineTextColor = () =>
    isPastDeadline ? "text-red-600 font-medium" : "text-gray-500";

  return (
    <div
      className={`flex items-center justify-between p-3 border ${
        isPastDeadline ? "border-red-300" : "border-gray-400"
      } ${getBgColor()} rounded-md shadow-sm w-full`}
    >
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => onCompletedChange(task.id, e.target.checked)}
            className="scale-125"
          />
          <span
            className={`flex-grow ${task.completed ? "line-through text-gray-400" : "text-black"}`}
          >
            {task.title}
          </span>
        </label>
        <p className={`text-sm ${getDeadlineTextColor()}`}>
          Deadline: {deadline.toDateString()} {deadline.toLocaleTimeString()}
          {isPastDeadline && " (Overdue)"}
        </p>
      </div>
      <button
        className="p-2 hover:bg-gray-200 rounded-md"
        onClick={() => onDelete(task.id)}
      >
        <Trash2 size={20} className="text-gray-500" />
      </button>
    </div>
  );
}

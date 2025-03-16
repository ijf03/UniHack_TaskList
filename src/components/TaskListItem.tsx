import { Trash2 } from "lucide-react";
import { Task } from "../types/task";
import { useEffect, useState } from "react";

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

  // Track overdue status in state so we can update it
  const [isPastDeadline, setIsPastDeadline] = useState<boolean>(
    deadline < new Date() && !task.completed
  );

  // Check deadline status every 10 seconds
  useEffect(() => {
    // Skip for completed tasks
    if (task.completed) return;

    // Initial check
    setIsPastDeadline(deadline < new Date());

    // Set up interval to check deadline status
    const timer = setInterval(() => {
      const isOverdue = deadline < new Date();
      if (isOverdue !== isPastDeadline) {
        setIsPastDeadline(isOverdue);
      }
    }, 10000); // Check every 10 seconds

    // Clean up interval when component unmounts
    return () => clearInterval(timer);
  }, [deadline, task.completed, isPastDeadline]);

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

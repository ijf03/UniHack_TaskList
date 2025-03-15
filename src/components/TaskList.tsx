import TaskItem from "./TaskListItem";
import { Task } from "../types/task";

interface TaskListProps {
  tasks: Task[];
  onCompletedChange: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export default function TaskList({
  tasks,
  onCompletedChange,
  onDelete,
}: TaskListProps) {
  const tasksSorted = tasks.sort((a, b) => {
    if (a.completed === b.completed) {
      return b.id - a.id;
    }
    return a.completed ? 1 : -1;
  });
  return (
    <>
      <div className="space-y-2">
        {tasksSorted.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onCompletedChange={onCompletedChange}
            onDelete={onDelete}
          />
        ))}
      </div>
      {tasks.length === 0 && (
        <p className="text-sm text-gray-500">
          {" "}
          No tasks yet. Add a new one above.
        </p>
      )}
    </>
  );
}

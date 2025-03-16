import TaskItem from "./TaskListItem";
import TasklistForm from "./TasklistForm";
import { Task } from "../types/task";

interface TaskListProps {
  tasks: Task[];
  onAddTask: (title: string, deadline: Date) => void;
  onUpdateTask: (id: number, completed: boolean) => void;
  onDeleteTask: (id: number) => void;
}

export default function TaskList({ tasks, onAddTask, onUpdateTask, onDeleteTask }: TaskListProps) {
  return (
    <div>
      <TasklistForm onSubmit={onAddTask} />
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onCompletedChange={onUpdateTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
      {tasks.length === 0 && <p className="text-sm text-gray-500">You're free... for now.</p>}
    </div>
  );
}

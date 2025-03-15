import { useState } from "react";

interface TasklistFormProps {
  onSubmit: (title: string, deadline: Date) => void;
}

export default function TasklistForm({ onSubmit }: TasklistFormProps) {
  const [input, setInput] = useState("");
  const [deadline, setDeadline] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim() || !deadline) return;

    onSubmit(input, new Date(deadline));
    setInput("");
    setDeadline("");
  }

  return (
    <div className="w-full p-4">
      <form
        className="flex items-center gap-2 p-3 border border-gray-400 bg-white rounded-md shadow-sm"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Shit to do..."
          className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-400 focus:outline-none"
        />

        {/* cal date picker deadline */}
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-400 focus:outline-none"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-emerald-400 text-white rounded-md hover:bg-emerald-500"
        >
          Add Task
        </button>
      </form>
    </div>
  );
}

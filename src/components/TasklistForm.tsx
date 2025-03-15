import { useState } from "react";

interface AddTaskFormProps {
  onSubmit: (title: string) => void;
}

export default function AddTaskForm({ onSubmit }: AddTaskFormProps) {
  const [input, setInput] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmit(input);
    setInput("");
  }

  return (
    <div className="w-full p-4">
      <form className="flex items-center gap-2 p-3 border border-gray-400 bg-white rounded-md shadow-sm" onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Shit to do..."
          className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-400 focus:outline-none"
        />
        <button type="submit" className="px-4 py-2 bg-emerald-400 text-white rounded-md hover:bg-emerald-500">
          Add
        </button>
      </form>
    </div>
  );
}

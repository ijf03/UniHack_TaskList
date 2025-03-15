import { useState } from 'react'


interface AddTaskFormProps {
    onSubmit: (title: string) => void
}

export default function AddTaskForm({onSubmit}: AddTaskFormProps) {

    const [input, setInput] = useState("")

        function handleSubmit(e:React.FormEvent<HTMLFormElement>) {
            e.preventDefault()
            if(!input.trim()) 
                return;
            onSubmit(input);
            setInput("");
            
        }
    return (
        <div>
            <form className="flex" onSubmit={handleSubmit}>
                <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                        placeholder="What shit do you need to do?" 
                        className="rounded-s-md grow border border-gray-400"
                />
                <button 
                type="submit"
                className="bg-emerald-500 text-white rounded-e-md hover:bg-emerald-800"
                >
                    Add
                </button>
            </form>
        </div>
    )
}
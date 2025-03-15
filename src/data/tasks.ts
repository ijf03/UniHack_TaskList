import { Task } from "../types/task";

export const dummyData: Task [] = [
    {
        id: 1,
        title: 'Die',
        completed: false,
        deadline: new Date('2025-4-11')
    },
    {
        id: 2,
        title: 'Sleep',
        completed: false,
        deadline: new Date('2025-10-12')
    },
    {
        id: 3,
        title: 'Eat',
        completed: false,
        deadline: new Date('2025-3-21')
    }
]
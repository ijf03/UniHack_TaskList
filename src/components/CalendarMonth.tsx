import React from "react";
import { DayPilotMonth } from "@daypilot/daypilot-lite-react";
import { Task } from "../types/task";

interface CalendarMonthProps {
  tasks: Task[];
}

const CalendarMonth: React.FC<CalendarMonthProps> = ({ tasks }) => {
  const onTaskClick = (args: { e: { data: Task } }) => {
    console.log(args.e.data);
  };

  return (
    <DayPilotMonth
      events={tasks.map((task) => ({
        id: task.id,
        text: task.title,
        start: task.deadline.toISOString(),
        end: task.deadline.toISOString(),
      }))}
      onEventClick={onTaskClick}
    />
  );
};

export default CalendarMonth;

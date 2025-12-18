import { Calendar, Circle } from "lucide-react";
import React from "react";
import type { Reminder } from "../types";

type Props = {
  reminder: Reminder;
};

const RemiderCard = ({ reminder }: Props) => {
  const priorityStyles = {
    high: "bg-blue-100 text-blue-700",
    medium: "bg-blue-50 text-blue-600",
    low: "bg-gray-100 text-gray-600",
  };

  return (
    <div
      key={reminder.id}
      className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition"
    >
      <div className="flex items-start gap-4">
        <button className="mt-1 text-blue-600">
          <Circle className="h-5 w-5 " />
        </button>

        <div className=" flex-1  space-y-2 text-start  ">
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                priorityStyles[reminder.priority]
              }`}
            >
              {reminder.priority.toUpperCase()}
            </span>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {reminder.dueDate}
            </div>
          </div>

          <h3 className="text-base font-semibold">{reminder.title}</h3>

          <p className="text-sm text-muted-foreground">
            {reminder.description}
          </p>

          <div className="text-sm">
            <span className="font-medium">{reminder?.companyName}</span>
            <span className="mx-2 text-muted-foreground">•</span>
            <span className="text-muted-foreground font-bold">
              {reminder?.clientStatus}
            </span>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RemiderCard;

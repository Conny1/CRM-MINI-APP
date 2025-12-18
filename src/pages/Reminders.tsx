import { useState } from "react";
import { AddReminder, ReminderCard } from "../components";
import type { Reminder } from "../types";

const mockReminders: Reminder[] = [
  {
    id: "1",
    clientId: "1",
    title: "Follow up on proposal",
    description: "Check if Sarah has reviewed the website redesign proposal",
    dueDate: "2024-02-15",
    completed: false,
    priority: "high",
    clientName: "Sarah Johnson",
    companyName: "Bright Labs",
    clientStatus: "lead",
  },
  {
    id: "2",
    clientId: "4",
    title: "Send contract",
    description: "Prepare and send contract for MVP development",
    dueDate: "2024-02-14",
    completed: false,
    priority: "high",
    clientName: "Michael Lee",
    companyName: "StartupX",
    clientStatus: "active",
  },
];

export default function Reminders() {
  const [reminders, setReminders] = useState(mockReminders);
  const [addremModal, setaddremModal] = useState(false)

  return (
    <div className="p-6 space-y-4 w-full  ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Reminders & Follow-ups
          </h1>
          <p className="text-sm text-muted-foreground">
            Never miss a client interaction
          </p>
        </div>
      </div>

      <section className="space-y-4">
        {/* Search + Filter */}
        <div className="flex gap-4">
          <input
            type="text"
            className="border rounded px-3 py-2 w-full"
            placeholder=""
          />

          <select className="border rounded px-3 py-2">
            <option value="All">All</option>
            <option value="All">High</option>
            <option value="All">Low</option>
            <option value="All">Medium</option>


          </select>

          <button onClick={()=>setaddremModal(true)}  className="bg-blue-600  cursor-pointer text-white  w-[150px] py-2 rounded">
            {/* <Plus className="h-4 w-4" /> */}
            Add Reminder
          </button>
        </div>

        <div className="grid gap-4">
          {reminders.map((reminder) => (
            <ReminderCard reminder={reminder} />
          ))}
        </div>
      </section>
  { addremModal &&   <AddReminder onClose={()=>{ setaddremModal(false) }} />}
    </div>
  );
}

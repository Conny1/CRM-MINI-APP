// import KanbanBoard from "../components/KanbanBoard";

import { KanbanBoard, UpcomingTasks } from "../components";

const stats = [
  { label: "New Leads", value: 12 },
  { label: "Deals Won", value: 5 },
  { label: "Deals Lost", value: 3 },
  { label: "Active Tasks", value: 7 },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Greeting */}
      <h1 className="text-2xl font-bold">Welcome back, Joel 👋</h1>

  

      {/* Pipeline */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Pipeline</h2>
        <KanbanBoard />
      </div>

         {/* Activity & Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
        <UpcomingTasks />
      </div>
    </div>
  );
}

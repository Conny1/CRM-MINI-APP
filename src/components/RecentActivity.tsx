// components/RecentActivity.tsx
import type { Activity } from "../types";
import { Phone, Mail, Users, CheckCircle, Calendar } from "lucide-react";

interface RecentActivityProps {
  activities: Activity[];
}

const activityIcons = {
  call: Phone,
  email: Mail,
  meeting: Users,
  deal: CheckCircle,
  task: Calendar,
};

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = activityIcons[activity.type];
        const iconColors = {
          call: "bg-blue-100 text-blue-600",
          email: "bg-purple-100 text-purple-600",
          meeting: "bg-green-100 text-green-600",
          deal: "bg-amber-100 text-amber-600",
          task: "bg-red-100 text-red-600",
        };

        return (
          <div key={activity.id} className="flex items-start space-x-3 group hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <div className={`p-2 rounded-lg ${iconColors[activity.type]}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-gray-500">{activity.time}</span>
                  <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
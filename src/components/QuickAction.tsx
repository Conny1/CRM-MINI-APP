// components/QuickActions.tsx
import { Plus, MessageSquare, FileText, UserPlus, CalendarPlus, Download } from "lucide-react";

const actions = [
  { icon: Plus, label: "New Deal", color: "bg-blue-100 text-blue-600", description: "Create a new sales deal" },
  { icon: MessageSquare, label: "Send Message", color: "bg-green-100 text-green-600", description: "Message a client" },
  { icon: FileText, label: "Create Proposal", color: "bg-purple-100 text-purple-600", description: "Draft a new proposal" },
  { icon: UserPlus, label: "Add Contact", color: "bg-amber-100 text-amber-600", description: "Add new client contact" },
  { icon: CalendarPlus, label: "Schedule", color: "bg-red-100 text-red-600", description: "Schedule a meeting" },
  { icon: Download, label: "Export Report", color: "bg-indigo-100 text-indigo-600", description: "Export monthly report" },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <button
            key={index}
            className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all text-left"
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${action.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {action.label}
                </h4>
                <p className="text-sm text-gray-500 mt-1">{action.description}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
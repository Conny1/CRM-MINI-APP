import { Calendar, Clock, User, Building, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import type { Reminder } from "../types";
import UpdateReminder from "./updateReminder";

type Props = {
  reminder: Reminder;
  onToggleComplete?: (id: string) => void;
};

const ReminderCard = ({ reminder, onToggleComplete }: Props) => {
  const [isCompleted, setIsCompleted] = useState(reminder.completed);
  const [updateModal, setupdateModal] = useState(false)

  const priorityStyles = {
    high: {
      bg: "bg-red-50 border-red-100",
      text: "text-red-700",
      dot: "bg-red-500",
      badge: "bg-red-100 text-red-700"
    },
    medium: {
      bg: "bg-amber-50 border-amber-100",
      text: "text-amber-700",
      dot: "bg-amber-500",
      badge: "bg-amber-100 text-amber-700"
    },
    low: {
      bg: "bg-blue-50 border-blue-100",
      text: "text-blue-700",
      dot: "bg-blue-500",
      badge: "bg-blue-100 text-blue-700"
    },
  };

  const statusColors = {
    lead: "text-purple-600 bg-purple-50 border-purple-100",
    active: "text-green-600 bg-green-50 border-green-100",
    inactive: "text-gray-600 bg-gray-50 border-gray-100"
  };

  type statusColorKeyType = keyof typeof statusColors

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        weekday: 'short'
      });
    }
  };

  const handleToggleComplete = () => {
    setIsCompleted(!isCompleted);
    if (onToggleComplete) {
      onToggleComplete(reminder._id);
    }
  };

  const priority = priorityStyles[reminder.priority];

  return (
    <div
      className={`
        rounded-xl border bg-white p-5 
        transition-all duration-200
        ${isCompleted ? 'opacity-60' : ''}
        ${priority.bg} border-l-4 ${priority.text} border-l-current
      hover:shadow-lg hover:border-opacity-80 hover:bg-gray-200
        cursor-pointer
      `}
      // onClick={handleToggleComplete}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button 
          className={`
            mt-0.5 flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center
            transition-all duration-200
            ${isCompleted 
              ? 'bg-green-100 border-green-300 text-green-600' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
          onClick={(e) => {
            e.stopPropagation();
            handleToggleComplete();
          }}
        >
          {isCompleted && <CheckCircle2 className="h-4 w-4" />}
        </button>

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Header with priority and date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${priority.badge}`}>
                <div className={`h-1.5 w-1.5 rounded-full ${priority.dot}`}></div>
                {reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)} Priority
              </div>
              
            { reminder?.clientStatus &&   <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${statusColors[reminder?.clientStatus as statusColorKeyType ]}`}>
                {reminder?.clientStatus.charAt(0).toUpperCase() + reminder?.clientStatus.slice(1)}
              </div>}
            </div>

            <div className={`flex items-center gap-1.5 text-sm font-medium ${isCompleted ? 'text-gray-500' : priority.text}`}>
              <Calendar className="h-4 w-4" />
              <span>{formatDate(reminder.dueDate)}</span>
              <Clock className="h-3 w-3 ml-1" />
            </div>
          </div>

          {/* Title and description */}
          <div>
            <h3 className={`
              text-base font-semibold leading-tight mb-2
              ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}
            `}>
              {reminder.title}
            </h3>
            
            <p className="text-sm text-gray-600 leading-relaxed">
              {reminder.description}
            </p>
          </div>

          {/* Client info */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-50 rounded-lg">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{reminder.clientName}</p>
                  <p className="text-xs text-gray-500">Client</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-50 rounded-lg">
                  <Building className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{reminder.companyName}</p>
                  <p className="text-xs text-gray-500">Company</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button 
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-lg
                  transition-colors duration-200
                  ${isCompleted 
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  
                  setupdateModal(true)
                }}
              >
                Edit
              </button>
              
              <button 
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-lg
                  transition-colors duration-200
                  ${isCompleted 
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle complete action
                }}
              >
                {isCompleted ? 'Reopen' : 'Complete'}
              </button>
            </div>
          </div>

          {/* Progress indicator */}
          {!isCompleted && (
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Due {formatDate(reminder.dueDate)}</span>
                <span>Urgent</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`
                    h-full rounded-full transition-all duration-500
                    ${priority.dot}
                  `}
                  style={{ 
                    width: reminder.priority === 'high' ? '90%' : 
                           reminder.priority === 'medium' ? '60%' : '30%' 
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
       { updateModal && <UpdateReminder initialData={reminder} onClose={()=>{ setupdateModal(false) }}  />  }
    </div>
  );
};

export default ReminderCard;
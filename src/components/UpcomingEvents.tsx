// components/UpcomingEvents.tsx
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useState } from "react";
import AddEventsModal from "./AddEventsModal";

const upcomingEvents = [
  {
    id: "1",
    title: "Client Presentation",
    client: "Bright Labs",
    time: "10:00 AM - 11:00 AM",
    date: "Today",
    type: "meeting",
    participants: 3,
    location: "Conference Room A",
  },
  {
    id: "2",
    title: "Contract Review",
    client: "TechCorp",
    time: "2:00 PM - 3:00 PM",
    date: "Tomorrow",
    type: "call",
    participants: 2,
    location: "Zoom Meeting",
  },
  {
    id: "3",
    title: "Quarterly Planning",
    client: "StartupX",
    time: "11:00 AM - 12:30 PM",
    date: "Feb 20",
    type: "meeting",
    participants: 5,
    location: "Board Room",
  },
];

export default function UpcomingEvents() {
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  return (
    <div className="space-y-4">
      {upcomingEvents.map((event) => (
        <div
          key={event.id}
          className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <div
                  className={`p-1 rounded ${
                    event.type === "meeting" ? "bg-blue-100" : "bg-purple-100"
                  }`}
                >
                  {event.type === "meeting" ? (
                    <Users className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Calendar className="h-4 w-4 text-purple-600" />
                  )}
                </div>
                <h4 className="font-medium text-gray-900">{event.title}</h4>
              </div>

              <p className="text-sm text-gray-600 mt-2">{event.client}</p>

              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[...Array(event.participants)].map((_, i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700"
                      >
                        {event.client.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {event.participants} people
                  </span>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button onClick={() => setIsAddEventOpen(true)} className="w-full cursor-pointer py-3 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-colors flex items-center justify-center space-x-2">
        <Calendar  className="h-5 w-5" />
        <span>Add new event</span>
      </button>

      <AddEventsModal
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        onSubmit={() => {}}
      />
    </div>
  );
}

// components/CalendarModal.tsx
import { useState, useMemo } from 'react';
import { Calendar, momentLocalizer, type View, type SlotInfo, type Event as RBCEvent } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar as CalendarIcon, X, Users, Phone, MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const localizer = momentLocalizer(moment);

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Event types
type EventType = 'meeting' | 'call';

interface CalendarEvent {
  id: string;
  title: string;
  client: string;
  start: Date;
  end: Date;
  type: EventType;
  participants: number;
  location: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  client: string;
  time: string;
  date: string;
  type: EventType;
  participants: number;
  location: string;
}

// Original data
const upcomingEventsData: UpcomingEvent[] = [
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

export default function CalendarModal({ isOpen, onClose }: CalendarModalProps) {
  const [currentView, setCurrentView] = useState<View>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // Convert events for calendar
  const events = useMemo(() => {
    return upcomingEventsData.map(event => {
      const today = new Date();
      const date = parseDateString(event.date, today);
      
      const [startTime, endTime] = event.time.split(' - ');
      const [startHour, startMinute] = parseTime(startTime);
      const [endHour, endMinute] = parseTime(endTime);
      
      const start = new Date(date);
      start.setHours(startHour, startMinute, 0);
      
      const end = new Date(date);
      end.setHours(endHour, endMinute, 0);
      
      return {
        id: event.id,
        title: event.title,
        client: event.client,
        start,
        end,
        type: event.type,
        participants: event.participants,
        location: event.location,
      };
    });
  }, []);

  // Helper functions
  function parseDateString(dateStr: string, referenceDate: Date): Date {
    const date = new Date(referenceDate);
    
    if (dateStr === 'Today') return date;
    if (dateStr === 'Tomorrow') {
      date.setDate(date.getDate() + 1);
      return date;
    }
    
    const [monthAbbr, day] = dateStr.split(' ');
    const monthMap: { [key: string]: number } = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    
    const monthIndex = monthMap[monthAbbr];
    if (monthIndex !== undefined) {
      date.setMonth(monthIndex);
      date.setDate(parseInt(day));
    }
    
    return date;
  }

  function parseTime(timeStr: string): [number, number] {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes = 0] = time.split(':').map(Number);
    
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    
    return [hours, minutes];
  }

  // Event handlers
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    console.log('Selected slot for new event:', slotInfo);
    // Add your new event logic here
  };

  const handleSelectEvent = (event: RBCEvent) => {
    const calendarEvent = events.find(e => e.id === event.id);
    if (calendarEvent) {
      setSelectedEvent(calendarEvent);
      setIsEventModalOpen(true);
    }
  };

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleViewChange = (newView: View) => {
    setCurrentView(newView);
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <>
      {/* Main Calendar Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-7xl transform overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <CalendarIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Calendar</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        View and manage all your scheduled events
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-sm bg-blue-500"></div>
                      <span className="text-sm text-gray-600">Meetings</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-sm bg-purple-500"></div>
                      <span className="text-sm text-gray-600">Calls</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                    + New Event
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Content */}
            <div className="p-8">
              {/* Calendar Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                    Today
                  </button>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <ChevronLeft className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <ChevronRight className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {moment(currentDate).format('MMMM YYYY')}
                  </h3>
                </div>

                <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                  {(['month', 'week', 'day', 'agenda'] as const).map((viewType) => (
                    <button
                      key={viewType}
                      onClick={() => handleViewChange(viewType)}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        currentView === viewType
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calendar */}
              <div className="h-[600px]">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '100%' }}
                  view={currentView}
                  date={currentDate}
                  onView={handleViewChange}
                  onNavigate={handleNavigate}
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={handleSelectEvent}
                  selectable
                  popup
                  eventPropGetter={(event: CalendarEvent) => ({
                    style: {
                      backgroundColor: event.type === 'meeting' ? '#3b82f6' : '#8b5cf6',
                      borderRadius: '6px',
                      border: 'none',
                      color: 'white',
                      padding: '4px 8px',
                      fontSize: '13px',
                      fontWeight: '500',
                    },
                  })}
                  views={['month', 'week', 'day', 'agenda']}
                  messages={{
                    today: 'Today',
                    previous: '◀',
                    next: '▶',
                    month: 'Month',
                    week: 'Week',
                    day: 'Day',
                    agenda: 'Agenda',
                    showMore: (count) => `+${count} more`,
                  }}
                />
              </div>

              {/* Stats */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Total Events</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{events.length}</p>
                      </div>
                      <CalendarIcon className="h-8 w-8 text-blue-400" />
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600 font-medium">Meetings</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {events.filter(e => e.type === 'meeting').length}
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-purple-400" />
                    </div>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-indigo-600 font-medium">Calls</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {events.filter(e => e.type === 'call').length}
                        </p>
                      </div>
                      <Phone className="h-8 w-8 text-indigo-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && isEventModalOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-black bg-opacity-50">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">with {selectedEvent.client}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsEventModalOpen(false);
                      setSelectedEvent(null);
                    }}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                {/* Event Type Badge */}
                <div className="mb-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    selectedEvent.type === 'meeting'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {selectedEvent.type === 'meeting' ? 'Meeting' : 'Call'}
                  </span>
                </div>

                {/* Event Details */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Date & Time</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedEvent.start.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedEvent.start.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })} -{' '}
                        {selectedEvent.end.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Location</p>
                      <p className="text-sm text-gray-600 mt-1">{selectedEvent.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Participants</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex -space-x-2">
                          {[...Array(Math.min(selectedEvent.participants, 5))].map((_, i) => (
                            <div
                              key={i}
                              className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700"
                            >
                              {selectedEvent.client.charAt(0)}
                            </div>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {selectedEvent.participants} {selectedEvent.participants === 1 ? 'person' : 'people'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
                  <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                    Join {selectedEvent.type === 'call' ? 'Call' : 'Meeting'}
                  </button>
                  <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
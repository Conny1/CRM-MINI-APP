// components/AddEventModal.tsx
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, Calendar, Clock, Users, MapPin, Video, Phone, Briefcase, MessageSquare } from 'lucide-react';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
}

interface EventFormData {
  title: string;
  client: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'call' | 'video' | 'presentation' | 'discussion';
  participants: number;
  location: string;
  description: string;
  customLocation?: string;
  additionalNotes?: string;
}

// Validation schema
const eventSchema = yup.object({
  title: yup
    .string()
    .required('Event title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  
  client: yup
    .string()
    .required('Client name is required')
    .min(2, 'Client name must be at least 2 characters'),
  
  date: yup
    .string()
    .required('Date is required')
    .test('is-future', 'Date cannot be in the past', function(value) {
      if (!value) return true;
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }),
  
  startTime: yup
    .string()
    .required('Start time is required'),
  
  endTime: yup
    .string()
    .required('End time is required')
    .test('is-after-start', 'End time must be after start time', function(value) {
      const { startTime, date } = this.parent;
      if (!value || !startTime || !date) return true;
      
      const startDateTime = new Date(`${date}T${startTime}`);
      const endDateTime = new Date(`${date}T${value}`);
      return endDateTime > startDateTime;
    }),
  
  type: yup
    .mixed<'meeting' | 'call' | 'video' | 'presentation' | 'discussion'>()
    .required('Event type is required')
    .oneOf(['meeting', 'call', 'video', 'presentation', 'discussion'], 'Invalid event type'),
  
  participants: yup
    .number()
    .required('Number of participants is required')
    .min(1, 'Minimum 1 participant required')
    .max(50, 'Maximum 50 participants allowed')
    .integer('Must be a whole number'),
  
  location: yup
    .string()
    .required('Location is required'),
  
  customLocation: yup
    .string()
    .when('location', {
      is: 'Other',
      then: (schema) => schema.required('Custom location is required').min(3, 'Location must be at least 3 characters'),
      otherwise: (schema) => schema.notRequired(),
    }),
  
  description: yup
    .string()
    .max(500, 'Description cannot exceed 500 characters'),
  
  additionalNotes: yup
    .string()
    .max(500, 'Notes cannot exceed 500 characters'),
}).required();

const eventTypes = [
  { id: 'meeting' as const, label: 'Meeting', icon: Users, color: 'bg-blue-100 text-blue-600' },
  { id: 'call' as const, label: 'Call', icon: Phone, color: 'bg-purple-100 text-purple-600' },
  { id: 'video' as const, label: 'Video Call', icon: Video, color: 'bg-green-100 text-green-600' },
  { id: 'presentation' as const, label: 'Presentation', icon: Briefcase, color: 'bg-orange-100 text-orange-600' },
  { id: 'discussion' as const, label: 'Discussion', icon: MessageSquare, color: 'bg-pink-100 text-pink-600' },
];

const locationOptions = [
  'Conference Room A',
  'Conference Room B',
  'Board Room',
  'Zoom Meeting',
  'Google Meet',
  'Microsoft Teams',
  'Phone Call',
  'In-person',
  'Other'
];

export default function AddEventModal({ isOpen, onClose, onSubmit }: AddEventModalProps) {
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<EventFormData>({
    resolver: yupResolver(eventSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      client: '',
      date: '',
      startTime: '09:00',
      endTime: '10:00',
      type: 'meeting',
      participants: 2,
      location: '',
      description: '',
      customLocation: '',
      additionalNotes: '',
    },
  });

  const selectedLocation = watch('location');
  const selectedType = watch('type');

  if (!isOpen) return null;

  const handleNextStep = async () => {
    let isValid = false;
    
    if (step === 1) {
      isValid = await trigger(['title', 'client', 'type', 'description']);
    } else if (step === 2) {
      isValid = await trigger(['date', 'startTime', 'endTime', 'participants', 'location']);
      if (selectedLocation === 'Other') {
        isValid = await trigger(['customLocation']) && isValid;
      }
    }
    
    if (isValid) {
      setStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleFormSubmit = async (data: EventFormData) => {
    try {
      // Combine location and custom location if needed
      const finalData = {
        ...data,
        location: selectedLocation === 'Other' && data.customLocation 
          ? data.customLocation 
          : data.location,
      };
      
      await onSubmit(finalData);
      reset();
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="border-b border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Schedule New Event</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Step {step} of 3 • {step === 1 ? 'Event Details' : step === 2 ? 'Time & Location' : 'Finalize'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  reset();
                  onClose();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                type="button"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      stepNumber === step 
                        ? 'bg-blue-600 text-white' 
                        : stepNumber < step 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-400'
                    } font-medium`}>
                      {stepNumber}
                    </div>
                    {stepNumber < 3 && (
                      <div className={`h-1 w-24 ${
                        stepNumber < step ? 'bg-blue-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm font-medium text-blue-600">Details</span>
                <span className={`text-sm font-medium ${
                  step >= 2 ? 'text-blue-600' : 'text-gray-400'
                }`}>Time & Location</span>
                <span className={`text-sm font-medium ${
                  step === 3 ? 'text-blue-600' : 'text-gray-400'
                }`}>Finalize</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="px-8 py-6">
            <div className="space-y-6">
              {/* Step 1: Event Details */}
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title *
                    </label>
                    <input
                      {...register('title')}
                      type="text"
                      placeholder="e.g., Client Presentation, Team Meeting"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                        errors.title ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client/Company Name *
                    </label>
                    <input
                      {...register('client')}
                      type="text"
                      placeholder="e.g., Bright Labs, TechCorp"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                        errors.client ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.client && (
                      <p className="mt-1 text-sm text-red-600">{errors.client.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Event Type *
                    </label>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {eventTypes.map((type) => (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => field.onChange(type.id)}
                              className={`flex items-center space-x-2 p-4 border rounded-lg transition-all ${
                                field.value === type.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className={`p-2 rounded-lg ${type.color}`}>
                                <type.icon className="h-4 w-4" />
                              </div>
                              <span className="font-medium text-gray-700">{type.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    />
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      {...register('description')}
                      placeholder="Brief description or agenda for the event..."
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    <div className="flex justify-between mt-1">
                      {errors.description ? (
                        <p className="text-sm text-red-600">{errors.description.message}</p>
                      ) : (
                        <p className="text-sm text-gray-500">Optional</p>
                      )}
                      <p className="text-sm text-gray-500">
                        {watch('description')?.length || 0}/500
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Time & Location */}
              {step === 2 && (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          {...register('date')}
                          type="date"
                          min={today}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                            errors.date ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {errors.date && (
                        <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Participants *
                      </label>
                      <Controller
                        name="participants"
                        control={control}
                        render={({ field }) => (
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={() => field.onChange(Math.max(1, field.value - 1))}
                              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              <span className="text-gray-600 font-medium">-</span>
                            </button>
                            <div className="flex-1 text-center">
                              <span className="text-lg font-semibold text-gray-900">
                                {field.value} {field.value === 1 ? 'person' : 'people'}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => field.onChange(field.value + 1)}
                              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              <span className="text-gray-600 font-medium">+</span>
                            </button>
                          </div>
                        )}
                      />
                      {errors.participants && (
                        <p className="mt-1 text-sm text-red-600">{errors.participants.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time *
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          {...register('startTime')}
                          type="time"
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                            errors.startTime ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {errors.startTime && (
                        <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time *
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          {...register('endTime')}
                          type="time"
                          min={watch('startTime')}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                            errors.endTime ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {errors.endTime && (
                        <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <select
                        {...register('location')}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none ${
                          errors.location ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select a location</option>
                        {locationOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                    )}
                    
                    {selectedLocation === 'Other' && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Custom Location *
                        </label>
                        <input
                          {...register('customLocation')}
                          type="text"
                          placeholder="Enter custom location"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                            errors.customLocation ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {errors.customLocation && (
                          <p className="mt-1 text-sm text-red-600">{errors.customLocation.message}</p>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Step 3: Finalize */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Summary</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <span className="text-gray-600">Title:</span>
                        <span className="font-medium text-gray-900 text-right">{watch('title')}</span>
                      </div>
                      <div className="flex items-start justify-between">
                        <span className="text-gray-600">Client:</span>
                        <span className="font-medium text-gray-900 text-right">{watch('client')}</span>
                      </div>
                      <div className="flex items-start justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium text-gray-900 text-right capitalize">{selectedType}</span>
                      </div>
                      <div className="flex items-start justify-between">
                        <span className="text-gray-600">Date & Time:</span>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">
                            {watch('date') ? new Date(watch('date')).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }) : 'Not specified'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {watch('startTime')} - {watch('endTime')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium text-gray-900 text-right">
                          {selectedLocation === 'Other' ? watch('customLocation') : watch('location')}
                        </span>
                      </div>
                      <div className="flex items-start justify-between">
                        <span className="text-gray-600">Participants:</span>
                        <span className="font-medium text-gray-900 text-right">
                          {watch('participants')} {watch('participants') === 1 ? 'person' : 'people'}
                        </span>
                      </div>
                      {watch('description') && (
                        <div className="flex items-start justify-between">
                          <span className="text-gray-600">Description:</span>
                          <span className="font-medium text-gray-900 text-right max-w-xs">
                            {watch('description')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      {...register('additionalNotes')}
                      placeholder="Any additional information or instructions..."
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none ${
                        errors.additionalNotes ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    <div className="flex justify-between mt-1">
                      {errors.additionalNotes ? (
                        <p className="text-sm text-red-600">{errors.additionalNotes.message}</p>
                      ) : (
                        <p className="text-sm text-gray-500">Optional</p>
                      )}
                      <p className="text-sm text-gray-500">
                        {watch('additionalNotes')?.length || 0}/500
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <div>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Back
                  </button>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    onClose();
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      isSubmitting || !isValid
                        ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center space-x-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Scheduling...</span>
                      </span>
                    ) : (
                      'Schedule Event'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
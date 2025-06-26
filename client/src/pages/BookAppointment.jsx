import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import API from '../api/api';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!date) return;
    setLoadingSlots(true);
    setSlotError('');
    API.get(`/doctors/${doctorId}/slots?date=${date}`)
      .then(res => setSlots(res.data))
      .catch(() => setSlotError('Failed to load slots'))
      .finally(() => setLoadingSlots(false));
  }, [date, doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/appointments', { doctor: doctorId, date, time });
      alert('Appointment booked!');
      window.location.href = '/my-appointments'; // Redirect and reload
    } catch (err) {
      alert('Booking failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Book Appointment
          </h1>
          <p className="mt-2 text-gray-600">Schedule your appointment with the doctor</p>
        </div>

        {/* Booking Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col h-full justify-between min-h-[500px]">
            <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-primary-600" />
                  </div>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="block w-full pl-10 py-3 text-sm border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time Slot
                </label>
                {loadingSlots ? (
                  <div className="text-gray-500">Loading slots...</div>
                ) : slotError ? (
                  <div className="text-red-500">{slotError}</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {slots.map(({ slot, available }) => (
                      <label key={slot} className={`px-3 py-2 rounded-lg border cursor-pointer ${available ? 'bg-white border-primary-300 hover:bg-primary-50' : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'}`}>
                        <input
                          type="radio"
                          name="slot"
                          value={slot}
                          disabled={!available}
                          checked={time === slot}
                          onChange={() => setTime(slot)}
                          className="mr-2"
                        />
                        {slot}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col h-full min-h-[500px] justify-between">
            <div className="text-center flex flex-col h-full justify-between">
              <div>
                <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center mb-6">
                  <CalendarIcon className="h-12 w-12 text-primary-600" />
                </div>
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
                  Booking Information
                </h2>
                <p className="text-gray-600 mb-6">
                  Select your preferred date and time for the appointment. Make sure to arrive 10 minutes before your scheduled time.
                </p>
              </div>
              <div className="space-y-4 text-left mt-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900">Available Hours</h3>
                  <p className="text-sm text-gray-500">Monday - Friday: 9:00 AM - 5:00 PM</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900">Appointment Duration</h3>
                  <p className="text-sm text-gray-500">30 minutes per session</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900">Cancellation Policy</h3>
                  <p className="text-sm text-gray-500">Free cancellation up to 24 hours before the appointment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;

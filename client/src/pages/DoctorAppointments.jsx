import { useEffect, useState } from 'react';
import API from '../api/api';
import { CalendarIcon } from '@heroicons/react/24/outline';

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [newTime, setNewTime] = useState('');
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState('');

  function formatTimeRange(start, end) {
    const to12 = (t) => {
      const [h, m] = t.split(':');
      const hour = ((+h % 12) || 12);
      const ampm = +h < 12 ? 'AM' : 'PM';
      return `${hour.toString().padStart(2, '0')}:${m} ${ampm}`;
    };
    return `${to12(start)} - ${to12(end)}`;
  }

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await API.get('/appointments/doctor');
        const now = new Date();
        // Mark as completed if end time is past
        const updated = response.data.map(a => {
          const apptDateTime = new Date(`${a.date}T${a.time}`);
          if (apptDateTime < now) {
            return { ...a, status: 'Completed' };
          }
          return a;
        });
        setAppointments(updated);
        setUpcoming(updated.filter((a) => a.status !== 'Completed'));
        setCompleted(updated.filter((a) => a.status === 'Completed'));
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (rescheduleId && newDate) {
      setLoadingSlots(true);
      setSlotError('');
      const appt = appointments.find(a => a._id === rescheduleId);
      let doctorId = '';
      if (appt) {
        if (typeof appt.doctor === 'string') {
          doctorId = appt.doctor;
        } else if (appt.doctor && appt.doctor._id) {
          doctorId = appt.doctor._id;
        }
      }
      API.get(`/doctors/${doctorId}/slots?date=${newDate}`)
        .then(res => setSlots(res.data))
        .catch(() => setSlotError('Failed to load slots'))
        .finally(() => setLoadingSlots(false));
    }
  }, [rescheduleId, newDate]);

  const handleReschedule = async (id) => {
    const formattedTime = newTime;
    await API.patch(`/appointments/${id}/reschedule`, { date: newDate, time: formattedTime });
    setAppointments(appointments.map(a => a._id === id ? { ...a, date: newDate, time: formattedTime, status: 'Pending' } : a));
    setRescheduleId(null);
    setNewDate('');
    setStartTime('');
    setEndTime('');
    setSlots([]);
  };

  const handleCancel = async (id) => {
    await API.delete(`/appointments/${id}`);
    setAppointments(appointments.filter((a) => a._id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="w-full bg-white/95 rounded-2xl shadow-sm p-6 mb-8 backdrop-blur-xl border border-gray-200/50">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Appointments
          </h1>
          <p className="mt-2 text-gray-600">Manage your patient appointments</p>
        </div>

        {appointments.length === 0 ? (
          <div className="w-full bg-white/95 rounded-2xl shadow-sm p-8 backdrop-blur-xl border border-gray-200/50">
            <div className="text-center">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                You have no appointments scheduled at the moment.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="bg-white rounded-2xl shadow-sm mb-4 p-6 flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{appointment.user.name}</h4>
                  <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                  <p className={`text-xs mt-1 font-semibold ${appointment.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>{appointment.status}</p>
                </div>
                <CalendarIcon className="h-6 w-6 text-primary-600 ml-2" />
                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    onClick={() => setRescheduleId(appointment._id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => handleCancel(appointment._id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    Cancel
                  </button>
                </div>
                {rescheduleId === appointment._id && (
                  <div className="mt-4 flex flex-col space-y-2">
                    <input
                      type="date"
                      value={newDate}
                      onChange={e => setNewDate(e.target.value)}
                      className="border rounded px-2 py-1"
                    />
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
                              checked={newTime === slot}
                              onChange={() => setNewTime(slot)}
                              className="mr-2"
                            />
                            {slot}
                          </label>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => handleReschedule(appointment._id)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      disabled={!newTime}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setRescheduleId(null)}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

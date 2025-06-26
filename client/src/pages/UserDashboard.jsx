// client/src/pages/UserDashboard.jsx
import { useEffect, useState } from 'react';
import API from '../api/api';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

const UserDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    API.get('/appointments/my', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const now = new Date();
        // Mark as completed if end time is past
        const updated = res.data.map(a => {
          const apptDateTime = new Date(`${a.date}T${a.time}`);
          if (apptDateTime < now) {
            return { ...a, status: 'Completed' };
          }
          return a;
        });
        setAppointments(updated);
      })
      .catch((err) => console.error('Error fetching appointments:', err));
  }, []);

  const handleCancel = async (id) => {
    const token = localStorage.getItem('token');
    await API.delete(`/appointments/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAppointments(appointments.filter((a) => a._id !== id));
  };

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
    const token = localStorage.getItem('token');
    await API.patch(`/appointments/${id}/user-reschedule`, { date: newDate, time: newTime }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAppointments(appointments.map(a => a._id === id ? { ...a, date: newDate, time: newTime, status: 'Pending' } : a));
    setRescheduleId(null);
    setNewDate('');
    setNewTime('');
    setSlots([]);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-100 flex flex-col items-center">
      <div className="w-full max-w-7xl px-2 sm:px-4 lg:px-8 py-8">
        <div className="w-full bg-white rounded-3xl shadow-lg p-8 mb-8 backdrop-blur-xl border border-gray-200/50 flex flex-col items-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent text-center">
            Your Appointments
          </h1>
          <p className="mt-3 text-lg text-gray-600 text-center">
            Manage your upcoming and past appointments
          </p>
        </div>

        {appointments.length === 0 ? (
          <div className="w-full bg-white rounded-2xl shadow-md p-12 flex flex-col items-center">
            <CalendarIcon className="mx-auto h-16 w-16 text-primary-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments found</h3>
            <p className="text-base text-gray-500 mb-6">
              Get started by booking your first appointment with a doctor.
            </p>
            <button
              type="button"
              onClick={() => window.location.href = '/doctors'}
              className="inline-flex items-center px-6 py-3 border border-transparent shadow-lg text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              <CalendarIcon className="h-6 w-6 mr-2" aria-hidden="true" />
              Book Appointment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="w-full bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between min-h-[260px]">
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                        <ClockIcon className="h-7 w-7 text-primary-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xl font-bold text-gray-900 truncate">
                        Dr. {appointment.doctor.name}
                      </h4>
                      <p className="text-base text-gray-500">
                        {appointment.date} at {appointment.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mb-2">
                    <button
                      onClick={() => setRescheduleId(appointment._id)}
                      className="inline-flex items-center px-5 py-2 border border-transparent rounded-lg text-base font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancel(appointment._id)}
                      className="inline-flex items-center px-5 py-2 border border-transparent rounded-lg text-base font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      Cancel
                    </button>
                  </div>
                  {rescheduleId === appointment._id && (
                    <div className="mt-4 flex flex-col space-y-3 bg-gray-50 rounded-xl p-4 border border-primary-100">
                      <input
                        type="date"
                        value={newDate}
                        onChange={e => setNewDate(e.target.value)}
                        className="border rounded px-3 py-2 text-base focus:ring-primary-500 focus:border-primary-500"
                      />
                      {loadingSlots ? (
                        <div className="text-gray-500">Loading slots...</div>
                      ) : slotError ? (
                        <div className="text-red-500">{slotError}</div>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          {slots.map(({ slot, available }) => (
                            <label key={slot} className={`px-4 py-2 rounded-lg border cursor-pointer text-base font-medium ${available ? 'bg-white border-primary-300 hover:bg-primary-50' : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'}`}>
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
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleReschedule(appointment._id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold text-base"
                          disabled={!newTime}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setRescheduleId(null)}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold text-base"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

import { useEffect, useState } from 'react';
import API from '../api/api';
import { CalendarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function MyAppointments() {
  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    API.get('/appointments/my', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setUpcoming(res.data.filter((a) => a.status !== 'Completed'));
        setCompleted(res.data.filter((a) => a.status === 'Completed'));
      })
      .catch((err) => console.error('Error fetching appointments:', err));
  }, []);

  const markCompleted = async (id) => {
    const token = localStorage.getItem('token');
    await API.patch(`/appointments/${id}/complete`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUpcoming(upcoming.filter((a) => a._id !== id));
    setCompleted([...completed, upcoming.find((a) => a._id === id)]);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full px-2 sm:px-4 lg:px-6 py-6">
        <div className="w-full bg-white rounded-2xl shadow-sm p-6 mb-6 backdrop-blur-xl">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            My Appointments
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary-700">Upcoming Appointments</h2>
            {upcoming.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-gray-500">No upcoming appointments</div>
            ) : (
              upcoming.map((appointment) => (
                <div key={appointment._id} className="bg-white rounded-2xl shadow-sm mb-4 p-6 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Dr. {appointment.doctor.name}</h4>
                    <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                  </div>
                  <button
                    onClick={() => markCompleted(appointment._id)}
                    className="ml-4 px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-all duration-200"
                  >
                    Mark as Completed
                  </button>
                  <CalendarIcon className="h-6 w-6 text-primary-600 ml-2" />
                </div>
              ))
            }
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4 text-secondary-700">Completed Appointments</h2>
            {completed.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-gray-500">No completed appointments</div>
            ) : (
              completed.map((appointment) => (
                <div key={appointment._id} className="bg-white rounded-2xl shadow-sm mb-4 p-6 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Dr. {appointment.doctor.name}</h4>
                    <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                  </div>
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

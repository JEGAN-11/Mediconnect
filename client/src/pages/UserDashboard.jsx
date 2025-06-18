// client/src/pages/UserDashboard.jsx
import { useEffect, useState } from 'react';
import API from '../api/api';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

const UserDashboard = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    API.get('/appointments', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error('Error fetching appointments:', err));
  }, []);

  const handleCancel = async (id) => {
    const token = localStorage.getItem('token');
    await API.delete(`/appointments/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAppointments(appointments.filter((a) => a._id !== id));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full px-2 sm:px-4 lg:px-6 py-6">
        <div className="w-full bg-white rounded-2xl shadow-sm p-6 mb-6 backdrop-blur-xl">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Your Appointments
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your upcoming and past appointments
          </p>
        </div>

        {appointments.length === 0 ? (
          <div className="w-full bg-white rounded-2xl shadow-sm p-8">
            <div className="text-center">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by booking your first appointment with a doctor.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => window.location.href = '/doctors'}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  <CalendarIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="w-full bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                        <ClockIcon className="h-6 w-6 text-primary-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-medium text-gray-900 truncate">
                        Dr. {appointment.doctor.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(appointment.date).toLocaleDateString()} at{' '}
                        {new Date(appointment.date).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => handleCancel(appointment._id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      Cancel
                    </button>
                  </div>
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

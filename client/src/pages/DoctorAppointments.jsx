import { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/doctors/appointments', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setAppointments(response.data);
        setUpcoming(response.data.filter((a) => a.status !== 'Completed'));
        setCompleted(response.data.filter((a) => a.status === 'Completed'));
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/doctors/appointments/${appointmentId}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      setAppointments(appointments.map(app => 
        app._id === appointmentId ? { ...app, status } : app
      ));
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const markCompleted = async (id) => {
    const token = localStorage.getItem('token');
    await axios.patch(`/appointments/${id}/complete`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUpcoming(upcoming.filter((a) => a._id !== id));
    setCompleted([...completed, upcoming.find((a) => a._id === id)]);
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
                </div>
                {upcoming.includes(appointment) && (
                  <button
                    onClick={() => markCompleted(appointment._id)}
                    className="ml-4 px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-all duration-200"
                  >
                    Mark as Completed
                  </button>
                )}
                <CalendarIcon className="h-6 w-6 text-primary-600 ml-2" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

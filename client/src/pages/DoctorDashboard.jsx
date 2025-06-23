import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DoctorProfile from './DoctorProfile';

export default function DoctorDashboard() {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    completedAppointments: 0,
  });
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/doctors/stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching doctor stats:', error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    // Check if doctor profile is incomplete (e.g., no experience or availability)
    if (user?.role === 'doctor' && (!user.experience || !user.availability)) {
      setShowProfile(true);
    }
  }, [user]);

  if (showProfile) {
    return <DoctorProfile onComplete={() => setShowProfile(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 bg-white rounded-2xl shadow-sm p-6 backdrop-blur-xl">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Welcome Dr. {user?.name}
          </h1>
          {user?.specialization && (
            <p className="mt-1 text-lg text-secondary-600 font-semibold">{user.specialization}</p>
          )}
          <p className="mt-2 text-gray-600">Here's an overview of your practice</p>
        </div>        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow-sm rounded-2xl hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="px-8 py-6">
              <dt className="text-sm font-medium text-gray-600 truncate">Total Appointments</dt>
              <dd className="mt-2 text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                {stats.totalAppointments}
              </dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-2xl hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="px-8 py-6">
              <dt className="text-sm font-medium text-gray-600 truncate">Today's Appointments</dt>
              <dd className="mt-2 text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                {stats.todayAppointments}
              </dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-2xl hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="px-8 py-6">
              <dt className="text-sm font-medium text-gray-600 truncate">Completed Appointments</dt>
              <dd className="mt-2 text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                {stats.completedAppointments}
              </dd>
            </div>
          </div>
        </div>        {/* Upcoming Appointments Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">Upcoming Appointments</h2>
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <p className="text-gray-600">No appointments scheduled</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">Recent Activity</h2>
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <p className="text-gray-600">No recent activity to show</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

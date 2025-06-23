import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function DoctorProfile({ onComplete }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    experience: '',
    availabilityDays: [],
    availabilityTime: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({
        ...prev,
        availabilityDays: checked
          ? [...prev.availabilityDays, value]
          : prev.availabilityDays.filter((d) => d !== value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/doctors/profile`,
        {
          experience: form.experience,
          availability: {
            days: form.availabilityDays,
            time: form.availabilityTime,
          },
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSuccess('Profile updated successfully!');
      if (onComplete) onComplete();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Complete Your Profile</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
          <input
            type="number"
            name="experience"
            min="0"
            required
            value={form.experience}
            onChange={handleChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="e.g. 5"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Available Days</label>
          <div className="flex flex-wrap gap-2">
            {days.map((day) => (
              <label key={day} className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={day}
                  checked={form.availabilityDays.includes(day)}
                  onChange={handleChange}
                  className="form-checkbox h-4 w-4 text-primary-600"
                />
                <span className="ml-2 text-gray-700">{day}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Available Time</label>
          <input
            type="text"
            name="availabilityTime"
            required
            value={form.availabilityTime}
            onChange={handleChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="e.g. 10:00 AM - 4:00 PM"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 rounded-lg text-white font-semibold bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transition-all"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}

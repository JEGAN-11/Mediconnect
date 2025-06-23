import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState('login'); // 'login', 'doctor', 'admin'
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login } = useAuth();

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Determine login endpoint and payload based on mode
      let endpoint = 'http://localhost:5000/api/auth/login';
      let payload = {
        email: form.email,
        password: form.password,
      };
      if (mode === 'admin') payload.role = 'admin';
      if (mode === 'doctor') payload.role = 'doctor';
      const res = await axios.post(endpoint, payload);
      login(res.data.user, res.data.token);
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="text-xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-bold">
          {mode === 'admin'
            ? 'Admin Login'
            : mode === 'doctor'
            ? 'Doctor Login'
            : 'User Login'}
        </span>
      }
    >
      <div className="mt-4">
        {/* Stronger hover effects for login role selector */}
        <div className="flex justify-center mb-6 gap-2">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`px-6 py-2 rounded-l-lg text-sm font-medium border border-primary-500 focus:outline-none transition-colors duration-200
              ${mode === 'login' ? 'bg-primary-500 text-white shadow-lg' : 'bg-white text-primary-600 hover:bg-primary-600 hover:text-white hover:shadow-lg'}`}
            style={{ minWidth: 100 }}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setMode('doctor')}
            className={`px-6 py-2 text-sm font-medium border-t border-b border-primary-500 focus:outline-none transition-colors duration-200
              ${mode === 'doctor' ? 'bg-secondary-500 text-white shadow-lg' : 'bg-white text-secondary-600 hover:bg-secondary-600 hover:text-white hover:shadow-lg'}`}
            style={{ minWidth: 100 }}
          >
            Doctor
          </button>
          <button
            type="button"
            onClick={() => setMode('admin')}
            className={`px-6 py-2 rounded-r-lg text-sm font-medium border border-primary-500 focus:outline-none transition-colors duration-200
              ${mode === 'admin' ? 'bg-gradient-to-r from-secondary-500 to-primary-500 text-white shadow-lg' : 'bg-white text-primary-600 hover:bg-gradient-to-r hover:from-secondary-600 hover:to-primary-600 hover:text-white hover:shadow-lg'}`}
            style={{ minWidth: 100 }}
          >
            Admin
          </button>
        </div>
        {error && (
          <div className="mb-6 p-4 bg-primary-50/50 border border-primary-200 text-primary-800 text-sm rounded-lg backdrop-blur-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email and password fields are the same for all roles */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {mode === 'admin' ? 'Admin Email' : mode === 'doctor' ? 'Doctor Email' : 'Email address'}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 sm:text-sm"
              placeholder={mode === 'admin' ? 'admin@mediconnect.com' : mode === 'doctor' ? 'doctor@example.com' : 'you@example.com'}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 sm:text-sm"
              placeholder="••••••••"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg hover:shadow-xl shadow-primary-500/25 hover:shadow-primary-500/35"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

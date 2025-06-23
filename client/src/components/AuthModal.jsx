import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    specialization: '',
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
      if (mode === 'login') {
        const res = await axios.post('http://localhost:5000/api/auth/login', {
          email: form.email,
          password: form.password,
        });
        login(res.data.user, res.data.token);
        onClose();
      } else if (mode === 'admin') {
        const res = await axios.post('http://localhost:5000/api/auth/login', {
          email: form.email,
          password: form.password,
        });
        if (res.data.user.role === 'admin') {
          login(res.data.user, res.data.token);
          onClose();
          window.location.href = '/admin';
        } else {
          setError('Not an admin account');
        }
      } else {
        const registerData = { ...form };
        if (registerData.role !== 'doctor') {
          delete registerData.specialization;
        }
        await axios.post('http://localhost:5000/api/auth/register', registerData);
        setMode('login');
        setError('Registration successful! Please log in.');
        setForm({ ...form, password: '' });
      }
    } catch (err) {
      setError(err.response?.data?.msg || `${mode === 'login' ? 'Login' : 'Registration'} failed`);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setForm({
      name: '',
      email: '',
      password: '',
      role: 'user',
      specialization: ''
    });
    setError('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="text-xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-bold">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </span>
      }
    >
      <div className="mt-4">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setMode('login')}
            className={`px-4 py-2 rounded-l-lg text-sm font-medium border border-primary-500 focus:outline-none ${mode === 'login' ? 'bg-primary-500 text-white' : 'bg-white text-primary-600'}`}
          >
            User Login
          </button>
          <button
            onClick={() => setMode('admin')}
            className={`px-4 py-2 rounded-r-lg text-sm font-medium border border-primary-500 focus:outline-none ${mode === 'admin' ? 'bg-primary-500 text-white' : 'bg-white text-primary-600'}`}
          >
            Admin Login
          </button>
        </div>
        {error && (
          <div className="mb-6 p-4 bg-primary-50/50 border border-primary-200 text-primary-800 text-sm rounded-lg backdrop-blur-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && (
            <>
              {/* Only allow user registration, remove doctor/admin options */}
              <input type="hidden" name="role" value="user" />
            </>
          )}
          {mode === 'admin' && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                placeholder="admin@mediconnect.com"
              />
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 mt-4">
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
          )}

          {mode !== 'admin' && (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                  placeholder="you@example.com"
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
            </>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg hover:shadow-xl shadow-primary-500/25 hover:shadow-primary-500/35"
            >
              {mode === 'login' ? 'Sign in' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm">
          {mode === 'login' ? (
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => switchMode('register')}
                className="font-medium bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent hover:from-primary-500 hover:to-secondary-500 transition-colors"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => switchMode('login')}
                className="font-medium bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent hover:from-primary-500 hover:to-secondary-500 transition-colors"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}

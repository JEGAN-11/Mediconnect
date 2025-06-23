import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/UserDashboard';
import Doctors from './pages/Doctors';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorAppointments from './pages/DoctorAppointments';
import HomeRedirect from './components/HomeRedirect';
import Register from './pages/Register';
import Login from './pages/Login';
import RegisterModal from './pages/RegisterModal';

import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <main className="flex-grow w-full pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterModal />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/doctors" element={<PrivateRoute><Doctors /></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/doctor-dashboard" element={<PrivateRoute><DoctorDashboard /></PrivateRoute>} />
          <Route path="/doctor-appointments" element={<PrivateRoute><DoctorAppointments /></PrivateRoute>} />
          <Route path="*" element={<HomeRedirect />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;

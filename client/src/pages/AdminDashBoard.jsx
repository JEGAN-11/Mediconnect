import { useEffect, useState } from 'react';
import API from '../api/api';

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    specialization: '',
    experience: '',
    contact: '',
    availabilityDays: '',
    availabilityTime: '',
  });
  const [editingId, setEditingId] = useState(null);

  const fetchDoctors = async () => {
    try {
      const res = await API.get('/doctors');
      setDoctors(res.data);
    } catch (err) {
      alert('Failed to load doctors');
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const res = await API.get('/auth/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  useEffect(() => {
    fetchDoctors();
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      specialization: form.specialization,
      experience: parseInt(form.experience),
      contact: form.contact,
      availability: {
        days: form.availabilityDays.split(',').map((d) => d.trim()),
        time: form.availabilityTime,
      },
    };

    try {
      if (editingId) {
        await API.put(`/doctors/${editingId}`, payload);
        setEditingId(null);
      } else {
        await API.post('/doctors', payload);
      }
      setForm({
        name: '',
        specialization: '',
        experience: '',
        contact: '',
        availabilityDays: '',
        availabilityTime: '',
      });
      fetchDoctors();
    } catch (err) {
      alert('Error saving doctor');
    }
  };

  const handleEdit = (doc) => {
    setForm({
      name: doc.name,
      specialization: doc.specialization,
      experience: doc.experience,
      contact: doc.contact,
      availabilityDays: doc.availability?.days?.join(', ') || '',
      availabilityTime: doc.availability?.time || '',
    });
    setEditingId(doc._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this doctor?')) return;
    try {
      await API.delete(`/doctors/${id}`);
      fetchDoctors();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    const token = localStorage.getItem('token');
    await API.delete(`/auth/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard – Manage Doctors</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
        <input
          placeholder="Name"
          className="p-2 border"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Specialization"
          className="p-2 border"
          value={form.specialization}
          onChange={(e) => setForm({ ...form, specialization: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Experience (years)"
          className="p-2 border"
          value={form.experience}
          onChange={(e) => setForm({ ...form, experience: e.target.value })}
          required
        />
        <input
          placeholder="Contact"
          className="p-2 border"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          required
        />
        <input
          placeholder="Availability Days (e.g. Mon, Wed)"
          className="p-2 border"
          value={form.availabilityDays}
          onChange={(e) => setForm({ ...form, availabilityDays: e.target.value })}
        />
        <input
          placeholder="Availability Time (e.g. 10:00 AM - 4:00 PM)"
          className="p-2 border"
          value={form.availabilityTime}
          onChange={(e) => setForm({ ...form, availabilityTime: e.target.value })}
        />

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-600 text-white py-2 rounded"
        >
          {editingId ? 'Update Doctor' : 'Add Doctor'}
        </button>
      </form>

      {/* Doctor List */}
      <div className="space-y-4">
        {doctors.map((doc) => (
          <div
            key={doc._id}
            className="flex justify-between items-center border rounded p-4 shadow"
          >
            <div>
              <p><strong>{doc.name}</strong> – {doc.specialization}</p>
              <p>Exp: {doc.experience} yrs | {doc.availability?.days?.join(', ')} | {doc.availability?.time}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(doc)}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(doc._id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Users List */}
      <h2 className="text-xl font-semibold mb-4">All Users</h2>
      <ul className="divide-y divide-gray-200 mb-8">
        {users.map((user) => (
          <li key={user._id} className="py-2 flex justify-between items-center">
            <span>{user.name} - {user.email}</span>
            <button onClick={() => handleDeleteUser(user._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;

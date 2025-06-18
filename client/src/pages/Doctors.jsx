import { useEffect, useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await API.get('/doctors');
        setDoctors(res.data);
      } catch (err) {
        alert('Failed to load doctors');
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doc) =>
    doc.specialization.toLowerCase().includes(filter.toLowerCase())
  );

  const handleBook = (doctorId) => {
    navigate(`/book/${doctorId}`);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full px-2 sm:px-4 lg:px-6 py-6">
        <div className="w-full bg-white/95 rounded-2xl shadow-sm p-6 mb-6 backdrop-blur-xl border border-gray-200/50">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Find a Doctor
          </h1>
          <p className="mt-2 text-gray-600">
            Browse through our network of qualified healthcare professionals
          </p>
        </div>

        <div className="w-full bg-white/95 rounded-2xl shadow-sm p-6 mb-6 backdrop-blur-xl border border-gray-200/50">
          <div className="w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Filter by specialization"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full p-3 pr-10 text-sm border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="w-full bg-white/95 rounded-2xl shadow-sm p-8 backdrop-blur-xl border border-gray-200/50">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No doctors found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search filters
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filteredDoctors.map((doc) => (
              <div key={doc._id} className="w-full bg-white/95 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-gray-200/50 backdrop-blur-xl">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center ring-2 ring-white shadow-lg">
                        <svg className="h-7 w-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-gray-900">Dr. {doc.name}</h4>
                      <p className="mt-1 text-sm text-primary-600 font-medium">{doc.specialization}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-gray-900">{doc.experience}</span> years of experience
                        </p>
                        <p className="text-sm text-gray-500">
                          Available: <span className="font-medium text-gray-900">{doc.availability?.days?.join(', ')}</span>
                          <br />
                          Time: <span className="font-medium text-gray-900">{doc.availability?.time}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => handleBook(doc._id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Book Appointment
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

export default Doctors;

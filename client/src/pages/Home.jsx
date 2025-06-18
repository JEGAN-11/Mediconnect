import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  CalendarIcon, 
  UserGroupIcon, 
  ClockIcon, 
  ShieldCheckIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Easy Scheduling',
    description: 'Book appointments with your preferred doctors in just a few clicks.',
    icon: CalendarIcon,
    color: 'bg-teal-500',
  },
  {
    name: 'Expert Doctors',
    description: 'Access to a wide network of qualified healthcare professionals.',
    icon: UserGroupIcon,
    color: 'bg-primary-500',
  },
  {
    name: '24/7 Availability',
    description: 'Round-the-clock access to medical consultation and support.',
    icon: ClockIcon,
    color: 'bg-secondary-500',
  },
  {
    name: 'Secure & Private',
    description: 'Your health information is protected with top-tier security.',
    icon: ShieldCheckIcon,
    color: 'bg-accent-500',
  },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/10"></div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/10"></div>
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white/10"></div>
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-white/10"></div>
          <div className="mx-auto w-full px-6 pb-24 pt-10 sm:pb-32 lg:px-8 lg:py-28">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-x-12 max-w-full">
            {/* Left Content */}
            <div className="text-center lg:text-left w-full lg:w-1/2 xl:w-3/5">
              <div className="mt-12 sm:mt-24 lg:mt-16">
                <div className="inline-flex space-x-6">
                  <span className="rounded-full bg-primary-500/10 px-3 py-1 text-sm font-semibold leading-6 text-primary-600 ring-1 ring-inset ring-primary-500/20">
                    What's new
                  </span>
                  <span className="inline-flex items-center space-x-2 text-sm font-medium text-primary-600">
                    <span>Just launched</span>
                    <ChevronRightIcon className="h-5 w-5 text-primary-500" />
                  </span>
                </div>
              </div>              <h1 className="mt-10 text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
                Your Health Journey <br />
                Starts Here
              </h1>
              <p className="mt-6 text-lg lg:text-xl leading-8 text-gray-600">
                Connect with trusted healthcare professionals, schedule appointments, and take control of your health journey - all in one place.
              </p>
              <div className="mt-10 flex items-center lg:justify-start justify-center gap-x-6">
                {!user ? (
                  <>
                    <button
                      onClick={() => window.openAuthModal?.('register')}
                      className="rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary-500/25 hover:from-primary-600 hover:to-secondary-600 hover:shadow-primary-500/35 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform hover:-translate-y-0.5"
                    >
                      Get started
                      <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
                    </button>
                    <button
                      onClick={() => window.openAuthModal?.('login')}
                      className="text-base font-semibold leading-6 text-primary-600 px-6 py-4 rounded-full border-2 border-transparent hover:border-primary-200 hover:bg-primary-50 hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Sign in <span aria-hidden="true" className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/doctors"
                    className="rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary-500/25 hover:from-primary-600 hover:to-secondary-600 hover:shadow-primary-500/35 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Find Doctors
                    <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Right Image */}            <div className="mt-12 lg:mt-0 w-full lg:w-1/2 xl:w-2/5">
              <div className="relative">
                <div className="rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-br from-primary-100 via-white to-secondary-100 p-8 transform hover:scale-[1.02] transition-all duration-500">
                  <div className="aspect-[1636/1024] w-full flex justify-center items-center overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm ring-1 ring-primary-100/50">
                    <span className="text-primary-400/60 text-xl font-medium">
                      [Medical Image Placeholder]
                    </span>
                  </div>
                  <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-primary-500/10"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      {/* Features Section */}
      <div className="w-full mt-8 px-6 sm:mt-16 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-secondary-50/50 rounded-3xl -mx-4 -my-8"></div>
        <div className="relative">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Everything you need for better health
            </h2>
            <p className="mt-6 text-xl leading-8 text-gray-600">
              MediConnect provides a seamless experience for managing your healthcare needs.
            </p>
          </div>
          <div className="mt-16 sm:mt-20 lg:mt-24">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col items-center text-center group">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${feature.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

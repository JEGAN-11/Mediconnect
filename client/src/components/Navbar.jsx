import { Fragment, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon,
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  ClipboardIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import AuthModal from './AuthModal';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleLogout = () => {
    logout();
  };

  const openModal = (initialMode) => {
    setAuthMode(initialMode);
    setShowAuthModal(true);
  };

  const navigation = [
    { 
      name: 'Home', 
      href: '/', 
      current: location.pathname === '/',
      icon: HomeIcon
    },
    ...(user?.role === 'user' 
      ? [
          { 
            name: 'Find Doctors', 
            href: '/doctors', 
            current: location.pathname === '/doctors',
            icon: UserGroupIcon
          },
          { 
            name: 'My Appointments', 
            href: '/dashboard', 
            current: location.pathname === '/dashboard',
            icon: CalendarIcon
          }
        ] 
      : []),
    ...(user?.role === 'doctor'
      ? [
          { 
            name: 'My Schedule', 
            href: '/doctor-dashboard', 
            current: location.pathname === '/doctor-dashboard',
            icon: ClipboardIcon
          },
          { 
            name: 'Appointments', 
            href: '/doctor-appointments', 
            current: location.pathname === '/doctor-appointments',
            icon: CalendarIcon
          }
        ]
      : []),
    ...(user?.role === 'admin'
      ? [
          { 
            name: 'Admin Dashboard', 
            href: '/admin', 
            current: location.pathname === '/admin',
            icon: ChartBarIcon
          }
        ]
      : [])
  ];

  return (
    <Disclosure as="nav" className="fixed top-0 left-0 right-0 w-full bg-white/80 backdrop-blur-md shadow-md z-50">
      {({ open }) => (
        <>
          <div className="mx-auto w-full">
            <div className="flex h-16 items-center justify-between w-full px-4 sm:px-6 lg:px-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent hover:from-primary-500 hover:to-secondary-500 transition-all duration-300">
                    MediConnect
                  </Link>
                </div>
                <div className="hidden sm:ml-8 sm:flex sm:space-x-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        item.current
                          ? 'border-primary-500 text-primary-600 bg-primary-50/50'
                          : 'border-transparent text-gray-500 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/30',
                        'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border-b-2 transition-all duration-200'
                      )}
                    >
                      {item.icon && (
                        <item.icon className="h-5 w-5 mr-1.5 flex-shrink-0" aria-hidden="true" />
                      )}
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {!user ? (
                  <>
                    <div className="flex items-center space-x-4">
                      <Link
                        to="/login"
                        className="rounded-md px-4 py-2 text-sm font-medium border border-black bg-primary-100 text-primary-700 hover:bg-primary-600 hover:text-white hover:border-primary-600 hover:shadow-lg transition-all duration-200 shadow-sm focus:outline-none"
                        style={{ minWidth: 90 }}
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/register"
                        className="rounded-md px-4 py-2 text-sm font-medium border border-primary-600 bg-primary-500 text-white shadow-sm hover:bg-primary-100 hover:text-primary-700 hover:border-primary-600 hover:shadow-lg transition-all duration-200 focus:outline-none"
                        style={{ minWidth: 90 }}
                      >
                        Sign up
                      </Link>
                    </div>
                    <AuthModal
                      isOpen={showAuthModal}
                      onClose={() => setShowAuthModal(false)}
                      initialMode={authMode}
                    />
                  </>
                ) : (
                  <Menu as="div" className="relative ml-3">
                    <Menu.Button className="flex rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 p-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 hover:from-primary-200 hover:to-secondary-200">
                      <UserCircleIcon className="h-8 w-8 text-primary-600" aria-hidden="true" />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/10 focus:outline-none border border-gray-100">
                        <div className="px-5 py-3 border-b border-gray-100 rounded-t-2xl bg-gradient-to-r from-primary-50 to-secondary-50">
                          <p className="text-xs text-gray-500">Signed in as</p>
                          <p className="text-base font-semibold text-primary-700 truncate capitalize">{user.role}</p>
                        </div>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={classNames(
                                active
                                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 border border-black text-white'
                                  : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border border-transparent',
                                'w-full text-left block px-5 py-3 text-base font-medium rounded-b-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500'
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
              </div>
              <div className="flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden bg-white border-t border-gray-100">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-primary-600',
                    'flex items-center px-3 py-2 text-base font-medium rounded-lg transition-colors duration-150'
                  )}
                >
                  {item.icon && (
                    <item.icon className="h-5 w-5 mr-2 flex-shrink-0" aria-hidden="true" />
                  )}
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            {!user ? (
              <div className="border-t border-gray-200 px-2 py-4 space-y-2">
                <Disclosure.Button
                  as="button"
                  onClick={() => openModal('login')}
                  className="w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors duration-150"
                >
                  Sign in
                </Disclosure.Button>
                <Disclosure.Button
                  as="button"
                  onClick={() => openModal('register')}
                  className="w-full text-center px-3 py-2 text-base font-medium text-white bg-gradient-to-r from-secondary-500 to-primary-500 rounded-lg hover:from-secondary-600 hover:to-primary-600 transition-all duration-200"
                >
                  Sign up
                </Disclosure.Button>
              </div>
            ) : (
              <div className="border-t border-gray-200 px-2 py-4">
                <div className="px-3 py-2 border-b border-gray-100 mb-2">
                  <p className="text-sm text-gray-500">Signed in as</p>
                  <p className="text-sm font-medium text-gray-900">{user.role}</p>
                </div>
                <Disclosure.Button
                  as="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors duration-150"
                >
                  Sign out
                </Disclosure.Button>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;

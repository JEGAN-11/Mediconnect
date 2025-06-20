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
  };  const navigation = [
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
          { name: 'My Schedule', href: '/doctor-dashboard', current: location.pathname === '/doctor-dashboard' },
          { name: 'Appointments', href: '/doctor-appointments', current: location.pathname === '/doctor-appointments' }
        ]
      : []),
    ...(user?.role === 'admin'
      ? [{ name: 'Admin Dashboard', href: '/admin', current: location.pathname === '/admin' }]
      : [])
  ];
  return (    <Disclosure as="nav" className="w-full bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between w-full">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent hover:from-primary-500 hover:to-secondary-500 transition-all duration-300">
                    MediConnect
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        item.current
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:border-primary-300 hover:text-primary-600',
                        'inline-flex items-center border-b-2 px-3 pt-1 text-sm font-medium'
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
              <div className="hidden sm:ml-6 sm:flex sm:items-center">                {!user ? (
                  <>
                    <div className="flex items-center space-x-4">                      <button
                        onClick={() => openModal('login')}
                        className="rounded-md bg-white px-3 py-2 text-sm font-medium text-secondary-700 ring-1 ring-inset ring-secondary-200 hover:bg-secondary-50 transition-all duration-200"
                      >
                        Sign in
                      </button>
                      <button
                        onClick={() => openModal('register')}
                        className="rounded-md bg-gradient-to-r from-secondary-500 to-primary-500 px-4 py-2 text-sm font-medium text-white shadow-md hover:from-secondary-600 hover:to-primary-600 transition-all duration-200"
                      >
                        Sign up
                      </button>
                    </div>
                    <AuthModal
                      isOpen={showAuthModal}
                      onClose={() => setShowAuthModal(false)}
                      initialMode={authMode}
                    />
                  </>
                ) : (
                  <Menu as="div" className="relative ml-3">
                    <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                      <UserCircleIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
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
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'w-full text-left block px-4 py-2 text-sm text-gray-700'
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
              <div className="-mr-2 flex items-center sm:hidden">
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

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}                  className={classNames(
                    item.current
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-primary-300 hover:text-primary-600',
                    'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                  )}
                >
                  <div className="flex items-center">
                    {item.icon && (
                      <item.icon className="h-5 w-5 mr-2 flex-shrink-0" aria-hidden="true" />
                    )}
                    {item.name}
                  </div>
                </Disclosure.Button>
              ))}
            </div>            {!user ? (
              <div className="border-t border-gray-200 pb-3 pt-4">
                <div className="space-y-1">
                  <Disclosure.Button
                    as="button"
                    onClick={() => openModal('login')}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Sign in
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="button"
                    onClick={() => openModal('register')}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Sign up
                  </Disclosure.Button>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200 pb-3 pt-4">
                <div className="space-y-1">
                  <Disclosure.Button
                    as="button"
                    onClick={handleLogout}
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 w-full text-left"
                  >
                    Sign out
                  </Disclosure.Button>
                </div>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;

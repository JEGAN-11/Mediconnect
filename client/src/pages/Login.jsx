import AuthModal from '../components/AuthModal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();
  return (
    <AuthModal
      isOpen={showModal}
      onClose={() => navigate('/')}
      initialMode="login"
    />
  );
}

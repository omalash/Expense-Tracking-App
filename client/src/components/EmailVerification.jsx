import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from '../api/axios';

const EmailVerification = () => {
  const [status, setStatus] = useState('Verifying...');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    axios
      .get(`/api/verify?token=${token}`)
      .then(() => setStatus('Email verified! You can now log in.'))
      .catch(() => setStatus('Verification failed.'));
  }, []);

  return (
    <div className="container mt-5 text-center">
      <h3>{status}</h3>
      {status.includes('verified') && (
        <Link to="/login" className="btn btn-primary mt-3">
          Log In
        </Link>
      )}
    </div>
  );
};

export default EmailVerification;

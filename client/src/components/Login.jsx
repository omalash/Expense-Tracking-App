// src/components/Login.jsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  const { setAccessToken } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    userRef.current.focus();
  }, []);

  // Focus on error alert when errMsg changes
  useEffect(() => {
    if (errMsg) {
      errRef.current?.focus();
    }
  }, [errMsg]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg('');
    try {
      const response = await axios.post(
        '/api/user/login',
        JSON.stringify({ username, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      const accessToken = response.data.accessToken;
      setAccessToken(accessToken);
      navigate('/');
    } catch (error) {
      if (!error?.response) {
        setErrMsg('No server response');
      } else if (error.response.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (error.response.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4">Log In</h2>
      {errMsg && (
        <div ref={errRef} tabIndex="-1">
          <Alert variant="danger" onClose={() => setErrMsg('')} dismissible>
            {errMsg}
          </Alert>
        </div>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username or Email:</Form.Label>
          <Form.Control
            type="text"
            ref={userRef}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Log In
        </Button>
      </Form>
    </div>
  );
};

export default Login;

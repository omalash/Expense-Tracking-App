import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const userRef = useRef();
  const { setAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [matchPwd, setMatchPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [username, pwd, matchPwd, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/user/register', {
        firstname,
        lastname,
        username,
        email,
        password: pwd,
        matchedPassword: matchPwd,
      });

      const loginRes = await axios.post('/api/user/login', { username, password: pwd });
      const token = loginRes.data.accessToken;
      setAccessToken(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/');
    } catch (err) {
      setErrMsg(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="container mt-5">
      {errMsg && <div className="alert alert-danger">{errMsg}</div>}
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">First Name</label>
          <input
            ref={userRef}
            type="text"
            className="form-control"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>
        <div className="col-md-12">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="col-md-12">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            value={matchPwd}
            onChange={(e) => setMatchPwd(e.target.value)}
            required
          />
        </div>
        <div className="col-12">
          <button className="btn btn-success w-100">Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
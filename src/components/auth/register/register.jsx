import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/authContext/authContext';
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth';
import './register.css';

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { userLoggedIn } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error messages
    setErrorMessage('');

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (!isRegistering) {
      setIsRegistering(true);
      try {
        await doCreateUserWithEmailAndPassword(email, password);
        navigate('/home'); // Navigate to home on successful registration
      } catch (error) {
        setErrorMessage(error.message);
        setIsRegistering(false);
      }
    }
  };

  return (
    <div className="page-register">
      {userLoggedIn && <Navigate to={'/home'} replace={true} />}
      <div className="page-login-container">
        <div>Create a New Account </div>
        <form onSubmit={onSubmit} className="sign_up">
          <div className="page-register-inputs-container">
            <label> Email </label>
            <input
              className="page-register-inputs"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>

          <div className="page-register-inputs-container">
            <label> Password </label>
            <input
              className="page-register-inputs"
              disabled={isRegistering}
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          <div className="page-register-inputs-container">
            <label>Confirm Password</label>
            <input
              className="page-register-inputs"
              disabled={isRegistering}
              type="password"
              autoComplete="off"
              required
              value={confirmPassword}
              onChange={(e) => {
                setconfirmPassword(e.target.value);
              }}
            />
          </div>

          {errorMessage && (
            <span className="text-red-600 font-bold">{errorMessage}</span>
          )}

          <button type="submit" disabled={isRegistering}>
            {isRegistering ? 'Signing Up...' : 'Sign Up'}
          </button>

          <p> Already have an account? <Link to={'/login'}> Continue </Link> </p>
        </form>
      </div>
    </div>
  );
};

export default Register;

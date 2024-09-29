import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../../firebase/auth';
import { useAuth } from '../../../contexts/authContext/authContext';
import './login.css';

const Login = () => {
    const { userLoggedIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            setErrorMessage(''); // Clear any existing error message
            try {
                await doSignInWithEmailAndPassword(email, password);
            } catch (error) {
                setErrorMessage(error.message);
                setIsSigningIn(false);
            }
        }
    };

    const onGoogleSignIn = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            setErrorMessage(''); // Clear any existing error message
            try {
                await doSignInWithGoogle();
            } catch (error) {
                setErrorMessage(error.message);
                setIsSigningIn(false);
            }
        }
    };

    return (
        <div className="page-login">
            {userLoggedIn && <Navigate to={'/'} replace={true} />}
            <div className="page-login-container">
                <div>Sign In</div>

                <form onSubmit={onSubmit} className="sign_in">
                    <div className='page-login-inputs-container'>
                        <label> Email </label>
                        <input
                            className='page-login-inputs'
                            type="email"
                            autoComplete='email'
                            required
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); }}
                        />
                    </div>

                    <div className='page-login-inputs-container'>
                        <label> Password </label>
                        <input
                            className='page-login-inputs'
                            type="password"
                            autoComplete='current-password'
                            required
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); }}
                        />
                    </div>

                    {errorMessage && (
                        <span className="error-message"> {errorMessage} </span>
                    )}

                    <button type="submit" disabled={isSigningIn}>
                        {isSigningIn ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <button
                    className="button-google"
                    disabled={isSigningIn}
                    onClick={(e) => { onGoogleSignIn(e); }}
                >
                    {isSigningIn ? 'Signing In...' : 'Continue with Google'}
                </button>

                <div className="create-account-button">
                    <Link to={'/register'}>Create account</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;

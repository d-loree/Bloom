import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext/authContext';
import { doSignOut } from '../../firebase/auth';
import './header.css';

const Header = () => {
    const navigate = useNavigate();
    const { userLoggedIn } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignOut = async () => {
        try {
            await doSignOut();
            navigate('/login');
        } catch (error) {
            console.error("Error during sign-out:", error);
            setErrorMessage('Failed to sign out. Please try again.');
        }
    };

    return (
        <div className='header'>
            {userLoggedIn ? (
                <Link to={'/home'} className='header-logo'>
                    BLOOM
                </Link>
            ) : (
                <Link to={'/'} className='header-logo'>
                    BLOOM
                </Link>
            )}
            <div className='header-right'>
                <Link className='header-link-Profile' to={'/profile'}>
                    Profile
                </Link>
                {userLoggedIn ? (
                    <>
                        <button
                            className='header-link-login-container'
                            onClick={handleSignOut}
                        >
                            Logout
                        </button>
                        {errorMessage && (
                            <span className='header-error-message'>
                                {errorMessage}
                            </span>
                        )}
                    </>
                ) : (
                    <Link className='header-link-login-container' to={'/login'}>
                        <span className='header-link-login'>Login</span>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Header;

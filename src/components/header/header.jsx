import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext/authContext'
import { doSignOut } from '../../firebase/auth'
import './header.css'

const Header = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()
    return (
        <div className='header'>
            {userLoggedIn ? <Link to={'/home'} className = 'header-logo'> BLOOM </Link> : <Link to={'/'} className = 'header-logo'> BLOOM </Link> }
            <div className = 'header-right'>
                <Link className = 'header-link-Profile' to={'/profile'}>Profile</Link>
                {
                    userLoggedIn
                        ?
                        <button className='header-link-login-container' onClick={() => { doSignOut().then(() => { navigate('/login') }) }}>
                            Logout
                        </button>
                        :
                        <Link className='header-link-login-container' to={'/login'}>
                                <span className='header-link-login'>Login</span>
                        </Link>

                }
            </div>

        </div>
    )
}

export default Header
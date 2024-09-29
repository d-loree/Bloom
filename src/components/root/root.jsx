import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext/authContext';
import Home from '../home/home';
import './root.css';

const Root = () => {
  const [authError, setAuthError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    try {
      // This checks if there's an issue with getting the current user
      if (!currentUser) {
        console.log("Unable to fetch user information. Please try reloading the page.");
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      setAuthError("An unexpected error occurred. Please try again later.");
    }
  }, [currentUser]);

  // Display Home component if user is logged in
  if (currentUser) {
    return <Home />;
  }

  return (
    <>
      <div className='hero-container bg-green-gr'>
        <div className='left-hero text-dropshadow center-text'>
          <h1 className='title'>Bloom</h1>
          <p className='caption'>Build a culture where people <i>grow</i></p>
        </div>
      
        <div className='right-hero'>
          <img className='plant-img' src="main_plant.png"/>
        </div>
      </div>

      <div className='hero-container bg-green-2'>
        <div className='left-hero'>
          <img className='plant-img' src="people_working.png"/>
        </div>
      
        <div className='right-hero center-text'>
          <h1 className='title'>Develop Skills</h1>
          <p className='caption'>Get constructive feedback to work on the weak areas you may not know about</p>
        </div>
      </div>
    </>


  );
};

export default Root;

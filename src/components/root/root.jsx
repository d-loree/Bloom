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
    <div>
        <div className="image-container">
            <img src= '/office_person.png' alr="office" className = "office-image"/>
            <p class="title">
                Build a culture where people BLOOM
            </p>
            <p class="info">
                Get the tools and insights you need to bloom a better version of yourself.
            </p>
        </div>

      <div className="section">
        <div className="circle-container">
          <div className="text-container">
            <h4>EMPLOYEE ENGAGEMENT MATTERS</h4>
            <h2>Grow. Retain. Recruit.</h2>
            <p>
              Organizations with high employee engagement scores are 21% higher probability
              than those who are low. They're also better able to retain and recruit top talent.
            </p>
            {/* <button>Learn More</button> */}
          </div>
          <div className="image-circle"></div>
        </div>
      </div>

      <div className="section grey-bg">
        <div className="circle-container">
          <div className="image-circle"></div>
          <div className="text-container">
            <h2>Get the formula for success.</h2>
            <p>
              Our software helps organizations work out employee feedback so that HR leaders
              are empowered to bring positive organizational change and improve employee engagement.
            </p>
            {/* <button>Learn How</button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Root;

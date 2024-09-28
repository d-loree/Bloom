
import React from 'react'
import { useAuth } from '../../contexts/authContext/authContext'
import Home from '../home/home';
import './root.css'


const Root = () => {
    const { currentUser } = useAuth();

  // Check if user is logged in
  if (currentUser) {
    return <Home />;
  }

    return (
        <div>

            <div class="background"> 
                <div class="transbox">
                    <p class="title">
                        Build a culture where people BLOOM
                    </p>
                    <p class="info">
                        Get the tools and insights you need to bloom a better version of yourself.
                    </p>
                </div>
            </div>



            <div class="section">
                <div class="circle-container">
                    <div class="text-container">
                        <h4>EMPLOYEE ENGAGEMENT MATTERS</h4>
                        <h2>Grow. Retain. Recruit.</h2>
                        <p>Organizations with high employee engagement scores are 21% higher probability than those who are low. They're also better able to retain and recruit top talent.</p>
                        {/* <button>Learn More</button> */}
                    </div>
                    <div class="image-circle">
                    </div>
                </div>
            </div>

            <div class="section grey-bg">
                <div class="circle-container">
                    <div class="image-circle">
                    </div>
                    <div class="text-container">
                        <h2>Get the formula for success.</h2>
                        <p>Our software helps organizations work out employee feedback so that HR leaders are empowered to bring positive organizational change and improve employee engagement.</p>
                        {/* <button>Learn How</button> */}
                    </div>
                </div>
            </div>




        </div>
        
    )
}

export default Root
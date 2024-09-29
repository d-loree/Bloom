import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext/authContext';
import { db } from '../../firebase/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import './home.css';
import { requestFeedback } from '../../firebase/request_feedback';
import Root from '../root/root';
import { motion } from 'framer-motion'
import 'bootstrap-icons/font/bootstrap-icons.css';

const Home = () => {
  const { currentUser } = useAuth();
  const [content, setContent] = useState(0);
  const [teamName, setTeamName] = useState(' ');
  const [teamCode, setTeamCode] = useState(' ');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists() && userDoc.data().teams) {
            setContent(userDoc.data().teams.length);
          }
        } catch (error) {
          console.error("Error fetching team data:", error);
          setError("Failed to fetch user data. Please try again later.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const createTeam = async () => {
    try {
      const teamDocRef = doc(db, "teams", teamName);
      const teamDoc = await getDoc(teamDocRef);

      if (!teamDoc.exists()) {
        await setDoc(teamDocRef, {
          name: teamName,
          organization: "hack-the-hill"
        });
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, {
          teams: arrayUnion(teamName)
        });
        window.location.reload();
      } else {
        alert("Name already exists");
      }
    } catch (error) {
      console.error("Error creating team:", error);
      setError("Failed to create team. Please try again later.");
    }
  };

  const joinTeam = async () => {
    try {
      const teamDocRef = doc(db, "teams", teamCode);
      const teamDoc = await getDoc(teamDocRef);
      if (teamDoc.exists()) {
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, {
          teams: arrayUnion(teamCode)
        });
        window.location.reload();
      } else {
        alert("Team does not exist");
      }
    } catch (error) {
      console.error("Error joining team:", error);
      setError("Failed to join team. Please try again later.");
    }
  };

  if (!currentUser) {
    return <Root />;
  }

  return (
    <div className="dashboard-container">
      <motion.h2
        initial = {{ y: -300}}
        animate = {{ y: 0}}
        transition={{type: 'tween' , stiffness: 5}}
      > Welcome, {currentUser?.displayName || currentUser?.email}! </motion.h2 >
      <div class = "home-nav">
        {error && <div className="error-message">{error}</div>}
        <div className="card-container">
          <motion.div className="card"
            initial = {{ x: -200}}
            animate = {{ x: 0}}
            transition={{type: 'tween' , stiffness: 1}}
          >
            <h3>Feedback</h3>
            <p>Review your feedback to self improve</p>
            <Link className="card-button" to={'/view-feedback'}><i class="bi bi-chat-left-text-fill"></i></Link>
          </motion.div>

          <motion.div className="card"
            initial = {{ y: 200}}
            animate = {{ y: 0}}
            transition={{type: 'tween' , stiffness: 7050}}
          >
            <h3>Request Feedback</h3>
            <p>Request anonymous feedback from your team</p>
            <button onClick={() => requestFeedback(currentUser)}><i class="bi bi-rocket-takeoff-fill request-feedback"></i></button>
          </motion.div>

          <motion.div className="card"
            initial = {{ y: 200}}
            animate = {{ y: 0}}
            transition={{type: 'tween' , stiffness: 5}}
          >
            <h3>Inbox</h3>
            <p>Fill out requested feedback forms</p>
            <Link className="card-button" to={'/inbox'}><i class="bi bi-inbox-fill"></i></Link>
          </motion.div>

          <motion.div className="card"
            initial = {{ x: 200}}
            animate = {{ x: 0}}
            transition={{type: 'tween' , stiffness: 5}}
          >
            <h3>Team</h3>
            {
              content > 0
                ? (
                  <>
                    <p>View your team</p>
                    <Link className="card-button" to={'/team'}><i class="bi bi-cup-hot-fill"></i></Link>
                  </>
                )
                : 
                <>
                  <p>Create or join a team</p>
                  <div className="inputs-container">
                    <div className="input-set">
                      <input className="inputs" onChange={(e) => { setTeamName(e.target.value) }} />
                      <button onClick={createTeam}>Create</button>
                    </div>
                    <div className="input-set">
                      <input className="inputs" onChange={(e) => { setTeamCode(e.target.value) }} />
                      <button onClick={joinTeam}>Join</button>
                    </div>
                  </div>
                </>
            }
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;

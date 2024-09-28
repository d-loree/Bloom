import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext/authContext';
import { db } from '../../firebase/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import './home.css';
import { requestFeedback } from '../../firebase/request_feedback';
import Root from '../root/root';

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Root />;
  }

  return (
    <div className="dashboard-container">
      <h2>Welcome, {currentUser?.displayName || currentUser?.email}!</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="card-container">
        <div className="card">
          <h3>Inbox</h3>
          <p>You have X pending feedback forms to fill out.</p>
          <Link className="card-button" to={'/inbox'}>View Team</Link>
        </div>

        <div className="card">
          <h3>Request Feedback</h3>
          <button onClick={() => requestFeedback(currentUser)}>Request Feedback</button>
        </div>

        <div className="card">
          <h3>Your Team</h3>
          {
            content > 0
              ? <Link className="card-button" to={'/team'}>View Team</Link>
              : 
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
          }
        </div>

        <div className="card">
          <h3>View feedback</h3>
          <Link className="card-button" to={'/view-feedback'}>View</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from 'react';
import { Link} from 'react-router-dom'
import { useAuth } from '../../contexts/authContext/authContext';
import { db } from '../../firebase/firebase';
import { doc, getDoc, collection, query, getDocs, setDoc ,arrayUnion, updateDoc } from 'firebase/firestore';
import './home.css';
import { requestFeedback } from '../../firebase/request_feedback';
import Root from '../root/root';

const Home = () => {
    const { currentUser } = useAuth();
    const [content , setContent] = useState(0);
    const [teamName , setTeamName] = useState(' ');
    const [teamCode , setTeamCode] = useState(' ');
    // Check if user is not logged in
    if (!currentUser) {
        return <Root />;
    }
    let userDocRef = doc(db, "users", currentUser.uid);
    let userDoc = null;

    const noTeam = async () => {
        userDoc = await getDoc(userDocRef)
        if (userDoc.data()) {
            setContent(userDoc.data().teams.length)
        }
    }




    noTeam()
    const createTeam = async () => {
        
        const teamDocRef = doc(db, "teams", teamName);
        const teamDoc = await getDoc(teamDocRef);
        
        if (!teamDoc.exists()) {
            await setDoc(teamDocRef, {
                name: teamName,
                organization: "hack-the-hill"
            });
            await updateDoc(userDocRef, {
                teams: arrayUnion(teamName)
            });
        window.location.reload();
        } else {
            alert("Name already Exist")
        }
    }
    const joinTeam = async () => {
        const teamDocRef = doc(db, "teams", teamCode);
        const teamDoc = await getDoc(teamDocRef);
        if (teamDoc.exists()) {
            await updateDoc(userDocRef, {
                teams: arrayUnion(teamCode)
            });
        window.location.reload();
        } else {
            alert("Team does not exist")
        }
    }

    return (
        <div className="dashboard-container">
            <h2>Welcome, {currentUser && currentUser.displayName ? currentUser.displayName : currentUser.email }!</h2>
            <div className="card-container">

                <div className="card">
                    <h3>Inbox</h3>
                    <p>You have X pending feedback forms to fill out.</p>
                    <Link className = "card-button" to={'/inbox'}>View Team</Link>
                </div>

                <div className="card">
                    <h3>Request Feedback</h3>
                    <button onClick={() => requestFeedback(currentUser)}>Request Feedback</button>
                </div>

                <div className="card">
                    <h3>Your Team</h3>
                    {
                        content > 0 
                            ? <Link className = "card-button" to={'/team'}>View Team</Link>
                            : 
                            <div className = "inputs-container">
                                <div className = "input-set">
                                    <input className = "inputs" onChange = {(e) => { setTeamName(e.target.value) }}/><button onClick = {createTeam} > Create</button>
                                </div>
                                <div className = "input-set">
                                    <input className = "inputs" onChange = {(e) => { setTeamCode(e.target.value) }}/><button onClick = {joinTeam} > Join</button>
                                </div>
                            </div>   
                    }

                </div>

                <div className="card">
                    <h3>View feedback</h3>
                    <Link className = "card-button" to={'/view-feedback'}>View</Link>
                </div>
            </div>
        </div>
    );
};

export default Home

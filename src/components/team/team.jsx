import { useAuth } from '../../contexts/authContext/authContext';
import Root from '../root/root';
import { getTeamMembers } from '../../firebase/getTeamMembers';
import React, { useEffect, useState } from 'react';
import './team.css';

const Team = () => {
    const { currentUser } = useAuth();
    const [teamData, setTeamData] = useState({}); // State to store team data

    useEffect(() => {
        const fetchTeamMembers = async () => {
            if (currentUser) {
                try {
                    const result = await getTeamMembers(currentUser);
                    console.log("Team Members Data: ", result);
                    setTeamData(result); // Update state with the fetched data
                } catch (error) {
                    console.error("Error fetching team members: ", error);
                }
            }
        };

        fetchTeamMembers();
    }, [currentUser]);

    if (!currentUser) {
        return <Root />;
    }

    return (
        <div class="page-wrapper">
            <div className="team-container">
                <h1>Your Team(s)</h1>
                {Object.keys(teamData).length === 0 ? (
                    <p className="no-teams-message">No teams available.</p>
                ) : (
                    Object.entries(teamData).map(([teamName, emails]) => (
                        <div key={teamName}>
                            <h2>{teamName}</h2>
                            <ul>
                                {emails.map((email) => (
                                    <li key={email}>{email}</li>
                                ))}
                            </ul>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Team

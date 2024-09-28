import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext/authContext';
import { Navigate } from 'react-router-dom';
import { db } from '../../firebase/firebase'; // Import Firestore
import { doc, updateDoc } from "firebase/firestore"; // Import updateDoc from Firestore
import './profile.css';

const Profile = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If there is no user logged in, redirect or handle the issue
    if (!currentUser) {
      setError("No user is logged in.");
      setLoading(false);
    } else {
      // Set initial profile details from currentUser
      setDisplayName(currentUser?.displayName || "");
      setEmail(currentUser?.email || "");
      setLoading(false);
    }
  }, [currentUser]);

  const handleEdit = () => {
    setEditMode(!editMode);
    setError(null);
  };

  const handleSave = async () => {
    if (displayName.trim() === "") {
      setError("Display name cannot be empty.");
      return;
    }

    try {
      // Update user's display name in Firestore
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        displayName: displayName,
      });

      // Update the currentUser context after successful update
      setCurrentUser({ ...currentUser, displayName: displayName });

      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again later.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-header">Profile Page</h2>
      {error && <div className="profile-error">{error}</div>}
      <div className="profile-card">
        <div className="profile-info">
          <label className="profile-label">Display Name:</label>
          {editMode ? (
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="profile-input"
            />
          ) : (
            <p className="profile-text">{displayName || "No display name set"}</p>
          )}
        </div>
        <div className="profile-info">
          <label className="profile-label">Email:</label>
          <p className="profile-text">{email}</p>
        </div>

        {editMode && (
          <div className="profile-info">
            <label className="profile-label">Edit Email (Optional):</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="profile-input"
            />
          </div>
        )}

        <div className="profile-actions">
          {editMode ? (
            <>
              <button onClick={handleSave} className="profile-button save-button">Save</button>
              <button onClick={handleEdit} className="profile-button cancel-button">Cancel</button>
            </>
          ) : (
            <button onClick={handleEdit} className="profile-button edit-button">Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

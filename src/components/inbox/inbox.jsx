import React, {useState, useEffect } from 'react'
import { useAuth } from '../../contexts/authContext/authContext';

import { db } from '../../firebase/firebase';
import { doc, getDoc} from "firebase/firestore";



const Inbox = () => {
    const { currentUser } = useAuth();
    const [showNotification, setShowNotification] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const checkReportsDoc = async () => {
        try {
          if (currentUser) {
            // console.log(currentUser.uid);
            const reportsDocRef = doc(db, "report_form_join", currentUser.uid);
            const repDoc = await getDoc(reportsDocRef);
            // console.log(repDoc.id);

            if (repDoc.id) {
                const reportData = repDoc.data(); // Get document data
                if (reportData.status === false) {
                  setShowNotification(true);
                }
            }
          }
        } catch (err) {
          setError("Failed to fetch reports. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
  
      checkReportsDoc();
    }, [currentUser]);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return (
      <div>
        {error && <div className="error">{error}</div>}
        {showNotification && (
          <div className="notification">
            You have new reports to view!
          </div>
        )}
      </div>
    );
  };
  
  export default Inbox;
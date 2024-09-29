import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext/authContext';
import { db } from '../../firebase/firebase';
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import './inbox.css';

const Inbox = () => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportsAndEmails = async () => {
      try {
        if (!currentUser) {
          throw new Error("User is not authenticated.");
        }

        // Step 1: Get all reports linked to the current user with rstatus == false
        const reportsQuery = query(
          collection(db, "report_form_join"),
          where("user", "==", currentUser.uid),
          where("rstatus", "==", false)
        );

        const querySnapshot = await getDocs(reportsQuery);
        if (querySnapshot.empty) {
          setReports([]);
          setLoading(false);
          return;
        }

        const reportsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          reportId: doc.data().report, // Get the report ID from the report_form_join document
        }));

        // Step 2: Get the user_uid from the reports collection and then fetch the corresponding user email
        const reportsWithEmails = await Promise.all(
          reportsList.map(async (report) => {
            try {
              // Get the report document from the "reports" collection
              const reportDocRef = doc(db, "reports", report.reportId);
              const reportDoc = await getDoc(reportDocRef);

              if (reportDoc.exists()) {
                const userUid = reportDoc.data().user_uid;

                // Step 3: Get the user email from the "users" collection using user_uid
                const userDocRef = doc(db, "users", userUid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists() && userUid !== currentUser.uid) {
                  return { ...report, email: userDoc.data().email };
                }
              }
            } catch (err) {
              console.error(`Error fetching report or user details for report ID ${report.reportId}:`, err);
            }
            return { ...report, email: null };
          })
        );

        // Filter out reports with null emails (in case the current user's email is not needed)
        const filteredReports = reportsWithEmails.filter(report => report.email !== null);

        setReports(filteredReports);
      } catch (err) {
        console.error("Error fetching reports and emails:", err);
        setError("Failed to fetch reports and emails. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReportsAndEmails();
  }, [currentUser]);

  return (
    <div className='page-wrapper'>
      <div className='content-container'>
        {error && <div className="error">{error}</div>}
        {reports.length > 0 ? (
          <div className="notification centered">
            <h3>You have reports that need to be filled out</h3>
            <ul className='centered p-0'>
              {reports.map((report) => (
                <li key={report.reportId} className='centered'>
                  <button
                    key={report.reportId}
                    onClick={() => navigate('/form', { state: { reportId: report.reportId } })} className='btn-lg'>
                    Fill out form for {report.email}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>You have requested documents</div>
        )}
      </div>
    </div>
  );
};

export default Inbox;

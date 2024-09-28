import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { query, where, collection, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';

const FormPage = () => {
    const { state } = useLocation();
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const reportId = state?.reportId

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const reportRef = doc(db, "reports", reportId);

            // Update the feedback array by adding the new feedback as JSON
            await updateDoc(reportRef, {
                feedback: arrayUnion({
                    feedback: feedback,
                    submittedAt: new Date(),
                })
            });
            const reportFormJoinQuery = query(
                collection(db, "report_form_join"),
                where("report", "==", reportId)
            );
            const querySnapshot = await getDocs(reportFormJoinQuery);
    
            querySnapshot.forEach(async (docSnapshot) => {
                const reportFormJoinRef = docSnapshot.ref;
                await updateDoc(reportFormJoinRef, { rstatus: true });
            });

            navigate('/home');
        } catch (err) {
            setError("Failed to submit feedback. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Submit Feedback</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Feedback:</label>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </form>
        </div>
    );
};

export default FormPage;

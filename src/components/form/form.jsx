import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { query, where, collection, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';

const FormPage = () => {
    const { state } = useLocation();
    const reportId = state?.reportId;
    const navigate = useNavigate();

    const [q1, setQ1] = useState(1); // First number select
    const [q2, setQ2] = useState(1); // Second number select
    const [q3, setQ3] = useState(1); // Third number select
    const [q4, setQ4] = useState(""); // First text area
    const [q5, setQ5] = useState(""); // Second text area

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const reportRef = doc(db, "reports", reportId);

            // Update the feedback array by adding the new feedback as JSON
            await updateDoc(reportRef, {
                feedback: arrayUnion({
                    q1: q1,
                    q2: q2,
                    q3: q3,
                    q4: q4,
                    q5: q5,
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
                    <label>Q1 (Rate from 1 to 10):</label>
                    <select value={q1} onChange={(e) => setQ1(e.target.value)} required>
                        {[...Array(10)].map((_, i) => (
                            <option key={i+1} value={i+1}>{i+1}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Q2 (Rate from 1 to 10):</label>
                    <select value={q2} onChange={(e) => setQ2(e.target.value)} required>
                        {[...Array(10)].map((_, i) => (
                            <option key={i+1} value={i+1}>{i+1}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Q3 (Rate from 1 to 10):</label>
                    <select value={q3} onChange={(e) => setQ3(e.target.value)} required>
                        {[...Array(10)].map((_, i) => (
                            <option key={i+1} value={i+1}>{i+1}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Q4 (Your feedback):</label>
                    <textarea
                        value={q4}
                        onChange={(e) => setQ4(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Q5 (Additional comments):</label>
                    <textarea
                        value={q5}
                        onChange={(e) => setQ5(e.target.value)}
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

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { query, where, collection, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import './form.css';

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
        <div className='page-wrapper'>
            <div className='content-container'>
            <h2>Submit Anonymous Feedback</h2>
                {error && <div className="error">{error}</div>}
                <form onSubmit={handleSubmit} className='centered'>
                    <div className='question'>
                        <label>How effectively do you think I communicate with the team during projects?:</label>
                        <select value={q1} onChange={(e) => setQ1(e.target.value)} required>
                            {[...Array(10)].map((_, i) => (
                                <option key={i+1} value={i+1}>{i+1}</option>
                            ))}
                        </select>
                    </div>
                    <div className='question'>
                        <label>How would you rate my ability to meet project deadlines?:</label>
                        <select value={q2} onChange={(e) => setQ2(e.target.value)} required>
                            {[...Array(10)].map((_, i) => (
                                <option key={i+1} value={i+1}>{i+1}</option>
                            ))}
                        </select>
                    </div>
                    <div className='question'>
                        <label>How well do I respond to constructive criticism?:</label>
                        <select value={q3} onChange={(e) => setQ3(e.target.value)} required>
                            {[...Array(10)].map((_, i) => (
                                <option key={i+1} value={i+1}>{i+1}</option>
                            ))}
                        </select>
                    </div>

                    <div className='question'>
                        <label>Suggest one professional skill I should develop or improve:</label> <br/>
                        <textarea
                            value={q4}
                            onChange={(e) => setQ4(e.target.value)}
                            required
                        />
                    </div>
                    <div className='question'>
                        <label>Looking at our team's goals, in what ways do you think I can contribute more effectively?:</label> <br/>
                        <textarea
                            value={q5}
                            onChange={(e) => setQ5(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className='btn-lg'>
                        {loading ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormPage;

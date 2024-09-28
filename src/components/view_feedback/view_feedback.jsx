import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext/authContext';
import { db } from '../../firebase/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const ViewFeedback = () => {
  const { currentUser } = useAuth();
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        if (currentUser) {
          // Step 1: Query the feedback collection for all feedback left for the current user
          const feedbackQuery = query(
            collection(db, "feedback_forms"),
            where("reviewed_user", "==", currentUser.uid)
          );

          const querySnapshot = await getDocs(feedbackQuery);
          const feedbackList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));

          setFeedbackData(feedbackList);
        }
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("Failed to fetch feedback data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [currentUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Extract data for charts
  const chartData = {};
  feedbackData.forEach((feedback) => {
    for (let key in feedback) {
      if (typeof feedback[key] === 'number') { // Assuming close-ended questions have numeric values
        if (!chartData[key]) {
          chartData[key] = [];
        }
        chartData[key].push(feedback[key]);
      }
    }
  });

  // Prepare data for the chart
  const chartDatasets = Object.keys(chartData).map((question) => {
    const data = chartData[question];
    const averageValue =
      data.reduce((acc, value) => acc + value, 0) / data.length;

    return {
      label: question,
      data: [averageValue],
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 1,
    };
  });

  const barChartData = {
    labels: ["Average Evaluation"],
    datasets: chartDatasets,
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold pt-14">Feedback Forum</h2>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold">Feedback Responses:</h3>
        <div className="mt-4">
          {feedbackData.length > 0 ? (
            feedbackData.map((feedback, index) => (
              <div key={index} className="border p-4 mb-4 rounded shadow">
                <h4 className="text-lg font-semibold">Feedback {index + 1}</h4>
                <ul className="mt-2">
                  {Object.entries(feedback).map(([question, response], i) => (
                    question !== 'id' && question !== 'reviewed_user' && (
                      <li key={i} className="text-gray-700">
                        <strong>{question}:</strong> {response}
                      </li>
                    )
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div>No feedback available.</div>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold">Close-Ended Questions Evaluation:</h3>
        <div className="mt-4">
          {chartDatasets.length > 0 ? (
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Average Evaluation of Close-Ended Questions',
                  },
                },
              }}
            />
          ) : (
            <div>No data available for charts.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewFeedback;

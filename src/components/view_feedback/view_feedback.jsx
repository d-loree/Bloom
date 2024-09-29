import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext/authContext';
import { db } from '../../firebase/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './view_feedback.css'

const ViewFeedback = () => {
  const { currentUser } = useAuth();
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        if (currentUser) {
          // Query the "reports" collection to find reports linked to the current user
          const reportsQuery = query(
            collection(db, "reports"),
            where("user_uid", "==", currentUser.uid)
          );

          const querySnapshot = await getDocs(reportsQuery);

          // Extract feedback array from each report
          const feedbackList = [];
          querySnapshot.forEach((docSnapshot) => {
            const reportData = docSnapshot.data();
            if (reportData.feedback && Array.isArray(reportData.feedback)) {
              feedbackList.push(...reportData.feedback);
            }
          });

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

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Convert Firestore Timestamp to readable date string
  const formatValue = (value) => {
    if (value?.seconds && value?.nanoseconds) {
      const date = new Date(value.seconds * 1000);
      return date.toLocaleString(); // You can customize this format
    }
    return value;
  };

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
    <div className="page-wrapper">
      <div class="content-container idk">

        <h2>Feedback Forum</h2>

        <h3>Feedback Responses:</h3>
        <div>
          {feedbackData.length > 0 ? (
            feedbackData.map((feedback, index) => (
              <div key={index}>
                <h4>Feedback {index + 1}</h4>
                <ul>
                  {Object.entries(feedback).map(([question, response], i) => (
                    <li key={i}>
                      <strong>{question}:</strong> {typeof response === 'object' ? formatValue(response) : response}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div>No feedback available.</div>
          )}
        </div>

        <div className="centered">
          <h3>Close-Ended Questions Evaluation:</h3>
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

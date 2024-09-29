import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext/authContext';
import { db } from '../../firebase/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './view_feedback.css';

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
  const chartDatasets = Object.keys(chartData).map((question, index) => {
    const data = chartData[question];
    const totalValue = data.reduce((acc, value) => acc + value, 0);
    const averageValue = (totalValue / data.length) * 10; // Scale the average value out of 10

    return {
      label: question,
      data: [averageValue],
      backgroundColor: `rgba(${75 + index * 20}, 192, 192, 0.6)`,
      borderColor: `rgba(${75 + index * 20}, 192, 192, 1)`,
      borderWidth: 2,
      borderRadius: 10, // Rounded corners
    };
  });

  const barChartData = {
    labels: ["Average Evaluation (Out of 10)"],
    datasets: chartDatasets,
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: "'Helvetica Neue', 'Arial', sans-serif",
            weight: 'bold',
          },
          color: '#333',
        },
      },
      title: {
        display: true,
        text: 'Average Evaluation of Close-Ended Questions (Out of 10)',
        font: {
          size: 18,
          family: "'Helvetica Neue', 'Arial', sans-serif",
          weight: 'bold',
        },
        color: '#333',
        padding: {
          top: 20,
          bottom: 20,
        },
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        color: '#333',
        font: {
          size: 12,
          weight: 'bold',
        },
        formatter: (value) => value.toFixed(2),
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10, // Set the maximum value to 10
        ticks: {
          font: {
            size: 12,
          },
          color: '#666',
          padding: 10,
          stepSize: 1, // Steps of 1 for better readability
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
          lineWidth: 1,
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
          color: '#666',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="page-wrapper">
      <div className="content-container idk">

        <h2>Feedback Forum</h2>

        <h3>Feedback Responses:</h3>
        <div>
          {feedbackData.length > 0 ? (
            feedbackData.map((feedback, index) => (
              <div key={index}>
                <h4>Feedback {index + 1}</h4>
                <ul>
                  {Object.entries(feedback)
                    .filter(([question]) => question !== 'submittedAt') // Filter out the date field
                    .map(([question, response], i) => (
                      <li key={i}>
                        <strong>{question}:</strong> {typeof response === 'object' ? response.toString() : response}
                      </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div>No feedback available.</div>
          )}
        </div>

        <div className="chart-container centered">
          <h3>Close-Ended Questions Evaluation:</h3>
          {chartDatasets.length > 0 ? (
            <div style={{ height: '400px', width: '100%' }}>
              <Bar
                data={barChartData}
                options={chartOptions}
              />
            </div>
          ) : (
            <div>No data available for charts.</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ViewFeedback;

"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const TotalEarnings = () => {
  const data = {
    labels: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"],
    datasets: [
      {
        label: "Earnings",
        data: [12000, 18000, 22000, 20000, 24000, 26000],
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Expenses",
        data: [10000, 16000, 21000, 19000, 22000, 25000],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: true }, ticks: { beginAtZero: true } },
    },
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">This month</h3>
        <div className="text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m9-6a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
      <h2 className="text-3xl font-bold mt-2">$37.5K</h2>
      <p className="text-sm text-green-500 mt-1">+2.45% On track</p>
      <div className="mt-4 h-40">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default TotalEarnings;

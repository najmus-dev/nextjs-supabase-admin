"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const WeeklyRevenue = () => {
  const data = {
    labels: ["17", "18", "19", "20", "21", "22", "23"],
    datasets: [
      {
        label: "Revenue",
        data: [500, 800, 600, 1200, 900, 1000, 700],
        backgroundColor: "#4f46e5",
      },
      {
        label: "Profit",
        data: [300, 600, 400, 1000, 700, 800, 500],
        backgroundColor: "#10b981",
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
      <h3 className="text-sm font-medium text-gray-500 mb-4">Weekly Revenue</h3>
      <div className="h-40">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default WeeklyRevenue;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const StudentDashboard = () => {
  const [stats, setStats] = useState({});
  const [availableExams, setAvailableExams] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [statsResponse, examsResponse, resultsResponse] = await Promise.all(
        [
          axios.get("http://localhost:5000/api/student/dashboard/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/student/exams/available", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/student/results", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]
      );

      setStats(statsResponse.data);
      setAvailableExams(examsResponse.data);
      setRecentResults(resultsResponse.data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Student Dashboard
              </h1>
              <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Welcome, {user?.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4">
            <Link to="/student/dashboard" className="nav-link active">
              Dashboard
            </Link>
            <Link to="/student/exams" className="nav-link">
              Available Exams
            </Link>
            <Link to="/student/results" className="nav-link">
              My Results
            </Link>
            <Link to="/student/profile" className="nav-link">
              Profile
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Statistics */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 p-3">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Enrolled Courses
                  </h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.totalCourses || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 p-3">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Available Exams
                  </h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.availableExams || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="rounded-full bg-purple-100 p-3">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Exams Taken
                  </h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.totalExamsTaken || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="rounded-full bg-yellow-100 p-3">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Average Score
                  </h3>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.averagePercentage
                      ? `${stats.averagePercentage}%`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-6 sm:px-0">
          {/* Available Exams */}
          <div className="card">
            <h2 className="card-title">Available Exams</h2>
            {availableExams.length > 0 ? (
              <div className="space-y-4">
                {availableExams.slice(0, 3).map((exam) => (
                  <div
                    key={exam._id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h3 className="font-semibold text-gray-900">
                      {exam.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {exam.course?.name}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-500">
                        Deadline: {new Date(exam.deadline).toLocaleDateString()}
                      </span>
                      <Link
                        to={`/student/exams/${exam._id}/take`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition duration-200"
                      >
                        Take Exam
                      </Link>
                    </div>
                  </div>
                ))}
                {availableExams.length > 3 && (
                  <Link
                    to="/student/exams"
                    className="block text-center text-blue-600 hover:text-blue-800 mt-4"
                  >
                    View all {availableExams.length} available exams
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No available exams at the moment.</p>
            )}
          </div>

          {/* Recent Results */}
          <div className="card">
            <h2 className="card-title">Recent Results</h2>
            {recentResults.length > 0 ? (
              <div className="space-y-4">
                {recentResults.map((result) => (
                  <div
                    key={result._id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h3 className="font-semibold text-gray-900">
                      {result.exam?.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {result.course?.name}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span
                        className={`text-sm font-semibold ${
                          result.percentage >= 50
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.percentage}%
                      </span>
                      <span className="text-sm text-gray-500">
                        {result.score}/{result.totalMarks}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(result.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {recentResults.length > 5 && (
                  <Link
                    to="/student/results"
                    className="block text-center text-blue-600 hover:text-blue-800 mt-4"
                  >
                    View all results
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No exam results yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;

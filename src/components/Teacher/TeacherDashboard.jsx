import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";

// Import teacher components
import MyCourses from "./MyCourses";
import CreateExam from "./CreateExam";
import MyExams from "./MyExams";
import ExamResults from "./ExamResults";
import CourseStudents from "./CourseStudents";

const TeacherDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/teacher/dashboard/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActiveRoute = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
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
                Teacher Dashboard
              </h1>
              <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Welcome, {user?.firstName} {user?.lastName}
              </span>
              {user?.teacherId && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  ID: {user.teacherId}
                </span>
              )}
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
            <Link
              to="/teacher/dashboard"
              className={`nav-link ${
                isActiveRoute("/teacher/dashboard") ? "active" : ""
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/teacher/courses"
              className={`nav-link ${
                isActiveRoute("/teacher/courses") ? "active" : ""
              }`}
            >
              My Courses
            </Link>
            <Link
              to="/teacher/exams"
              className={`nav-link ${
                isActiveRoute("/teacher/exams") ? "active" : ""
              }`}
            >
              My Exams
            </Link>
            <Link
              to="/teacher/exams/create"
              className={`nav-link ${
                isActiveRoute("/teacher/exams/create") ? "active" : ""
              }`}
            >
              Create Exam
            </Link>
            <Link
              to="/teacher/results"
              className={`nav-link ${
                isActiveRoute("/teacher/results") ? "active" : ""
              }`}
            >
              Results
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/dashboard" element={<DashboardHome stats={stats} />} />
          <Route path="/courses" element={<MyCourses />} />
          <Route
            path="/courses/:courseId/students"
            element={<CourseStudents />}
          />
          <Route path="/exams" element={<MyExams />} />
          <Route path="/exams/create" element={<CreateExam />} />
          <Route path="/exams/:examId/results" element={<ExamResults />} />
          <Route path="/results" element={<ExamResults />} />
          <Route path="/" element={<DashboardHome stats={stats} />} />
        </Routes>
      </main>
    </div>
  );
};

// Dashboard Home Component
const DashboardHome = ({ stats }) => {
  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Courses"
          value={stats.totalCourses || 0}
          icon="📚"
          color="blue"
        />
        <StatCard
          title="Total Exams"
          value={stats.totalExams || 0}
          icon="📝"
          color="green"
        />
        <StatCard
          title="Active Exams"
          value={stats.activeExams || 0}
          icon="⏰"
          color="purple"
        />
        <StatCard
          title="Total Results"
          value={stats.totalResults || 0}
          icon="📊"
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuickAction
          title="Create Exam"
          description="Create a new exam for your course"
          link="/teacher/exams/create"
          color="green"
          icon="➕"
        />
        <QuickAction
          title="View My Courses"
          description="See all courses you're teaching"
          link="/teacher/courses"
          color="blue"
          icon="📚"
        />
        <QuickAction
          title="Check Results"
          description="View student exam results"
          link="/teacher/results"
          color="purple"
          icon="📊"
        />
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <p className="text-gray-500">
          Your recent exams and student submissions will appear here.
        </p>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="card">
      <div className="flex items-center">
        <div className={`rounded-full ${colorClasses[color]} p-3`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

// Quick Action Component
const QuickAction = ({ title, description, link, color, icon }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    green: "bg-green-50 border-green-200 hover:bg-green-100",
    purple: "bg-purple-50 border-purple-200 hover:bg-purple-100",
  };

  return (
    <Link
      to={link}
      className={`border rounded-lg p-6 transition duration-200 ${colorClasses[color]}`}
    >
      <div className="flex items-center">
        <span className="text-2xl mr-4">{icon}</span>
        <div>
          <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default TeacherDashboard;

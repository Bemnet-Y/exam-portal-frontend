import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";

// Import admin components
import UserManagement from "./UserManagement";
import CollegeManagement from "./CollegeManagement";
import DepartmentManagement from "./DepartmentManagement";
import CourseManagement from "./CourseManagement";
import StudentRegistration from "./StudentRegistration";
import TeacherRegistration from "./TeacherRegistration";
import BatchRegistration from "./BatchRegistration";

const AdminDashboard = () => {
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
        `${import.meta.env.VITE_API_URL}/admin/dashboard/stats`,
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
                Admin Dashboard
              </h1>
              <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Welcome, {user?.firstName || "Admin"}
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
            <Link
              to="/admin/dashboard"
              className={`nav-link ${
                isActiveRoute("/admin/dashboard") ? "active" : ""
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/users"
              className={`nav-link ${
                isActiveRoute("/admin/users") ? "active" : ""
              }`}
            >
              User Management
            </Link>
            <Link
              to="/admin/colleges"
              className={`nav-link ${
                isActiveRoute("/admin/colleges") ? "active" : ""
              }`}
            >
              Colleges
            </Link>
            <Link
              to="/admin/departments"
              className={`nav-link ${
                isActiveRoute("/admin/departments") ? "active" : ""
              }`}
            >
              Departments
            </Link>
            <Link
              to="/admin/courses"
              className={`nav-link ${
                isActiveRoute("/admin/courses") ? "active" : ""
              }`}
            >
              Courses
            </Link>
            <div className="relative group">
              <button className="nav-link">Registration ▼</button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <Link
                  to="/admin/register/student"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Register Student
                </Link>
                <Link
                  to="/admin/register/teacher"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Register Teacher
                </Link>
                <Link
                  to="/admin/register/batch"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Batch Registration
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/dashboard" element={<DashboardHome stats={stats} />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/colleges" element={<CollegeManagement />} />
          <Route path="/departments" element={<DepartmentManagement />} />
          <Route path="/courses" element={<CourseManagement />} />
          <Route path="/register/student" element={<StudentRegistration />} />
          <Route path="/register/teacher" element={<TeacherRegistration />} />
          <Route path="/register/batch" element={<BatchRegistration />} />
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents || 0}
          icon="👨‍🎓"
          color="blue"
        />
        <StatCard
          title="Total Teachers"
          value={stats.totalTeachers || 0}
          icon="👨‍🏫"
          color="green"
        />
        <StatCard
          title="Total Colleges"
          value={stats.totalColleges || 0}
          icon="🏫"
          color="purple"
        />
        <StatCard
          title="Total Courses"
          value={stats.totalCourses || 0}
          icon="📚"
          color="yellow"
        />
        <StatCard
          title="Total Exams"
          value={stats.totalExams || 0}
          icon="📝"
          color="red"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickAction
          title="Register Student"
          description="Add a new student"
          link="/admin/register/student"
          color="blue"
        />
        <QuickAction
          title="Register Teacher"
          description="Add a new teacher"
          link="/admin/register/teacher"
          color="green"
        />
        <QuickAction
          title="Manage Colleges"
          description="View and edit colleges"
          link="/admin/colleges"
          color="purple"
        />
        <QuickAction
          title="User Management"
          description="Manage all users"
          link="/admin/users"
          color="orange"
        />
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
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
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
const QuickAction = ({ title, description, link, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    green: "bg-green-50 border-green-200 hover:bg-green-100",
    purple: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    orange: "bg-orange-50 border-orange-200 hover:bg-orange-100",
  };

  return (
    <Link
      to={link}
      className={`border rounded-lg p-4 text-center transition duration-200 ${colorClasses[color]}`}
    >
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
    </Link>
  );
};

export default AdminDashboard;

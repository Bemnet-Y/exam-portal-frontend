import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      console.log("🔍 Frontend: Fetching courses for teacher...");
      console.log("   Teacher user:", user);
      console.log("   Token present:", !!token);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/teacher/courses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Frontend: Courses API response received");
      console.log("   Response status:", response.status);
      console.log("   Number of courses:", response.data.length);
      console.log("   Courses data:", response.data);

      setCourses(response.data);
    } catch (error) {
      console.error("❌ Frontend: Error fetching courses:", error);
      console.error("   Error response:", error.response);

      if (error.response?.status === 401) {
        alert("Authentication failed. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        alert("Failed to fetch courses. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Courses Assigned
          </h3>
          <p className="text-gray-500">
            You haven't been assigned to any courses yet.
          </p>
          <p className="text-gray-500">
            Please contact the administrator to get assigned to courses.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {course.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-mono">
                      {course.code}
                    </p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Year {course.year}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <span className="font-medium">College:</span>
                    <span className="ml-2">{course.college?.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Department:</span>
                    <span className="ml-2">{course.department?.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Credits:</span>
                    <span className="ml-2">{course.credits || 3}</span>
                  </div>
                </div>

                {course.description && (
                  <p className="text-sm text-gray-500 mb-4 border-t pt-3">
                    {course.description}
                  </p>
                )}

                <div className="flex space-x-3 pt-4 border-t">
                  <Link
                    to={`/teacher/courses/${course._id}/students`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-3 rounded text-sm font-medium transition duration-200"
                  >
                    View Students
                  </Link>
                  <Link
                    to={`/teacher/exams/create?course=${course._id}`}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-2 px-3 rounded text-sm font-medium transition duration-200"
                  >
                    Create Exam
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;

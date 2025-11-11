import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const CourseStudents = () => {
  const [students, setStudents] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { courseId } = useParams();

  useEffect(() => {
    fetchCourseStudents();
  }, [courseId]);

  const fetchCourseStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const [studentsResponse, coursesResponse] = await Promise.all([
        axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/teacher/courses/${courseId}/students`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axios.get(`${import.meta.env.VITE_API_URL}/teacher/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStudents(studentsResponse.data);

      // Find the current course from the courses list
      const currentCourse = coursesResponse.data.find(
        (c) => c._id === courseId
      );
      setCourse(currentCourse);
    } catch (error) {
      console.error("Error fetching course students:", error);
      alert("Failed to fetch course students");
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Link
            to="/teacher/courses"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2 inline-block"
          >
            ← Back to Courses
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Students - {course?.name}
          </h1>
          {course && (
            <p className="text-gray-600 mt-1">
              {course.code} • Year {course.year} • {course.college?.name}
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-900">
            {students.length}
          </div>
          <div className="text-sm text-gray-600">Enrolled Students</div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {students.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Students Enrolled
            </h3>
            <p className="text-gray-500">
              No students are currently enrolled in this course.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Year</th>
                    <th>College</th>
                    <th>Department</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td className="font-mono font-semibold">
                        {student.studentId}
                      </td>
                      <td className="font-medium">
                        {student.firstName} {student.lastName}
                      </td>
                      <td>{student.userId?.email}</td>
                      <td>Year {student.year}</td>
                      <td>{student.college?.name}</td>
                      <td>{student.department?.name}</td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            student.userId?.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.userId?.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Total students: {students.length}</span>
                <span>
                  Active: {students.filter((s) => s.userId?.isActive).length} •
                  Inactive: {students.filter((s) => !s.userId?.isActive).length}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to={`/teacher/exams/create?course=${courseId}`}
          className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:border-blue-300 transition duration-200"
        >
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <span className="text-2xl">📝</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Create Exam</h3>
              <p className="text-sm text-gray-600 mt-1">
                Create a new exam for this course
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/teacher/exams"
          className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:border-purple-300 transition duration-200"
        >
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">View Exams</h3>
              <p className="text-sm text-gray-600 mt-1">
                See all exams for this course
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CourseStudents;

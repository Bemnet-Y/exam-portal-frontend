import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const MyExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/teacher/exams`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setExams(response.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
      alert("Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (examId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this exam? This will also delete all student results for this exam."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/exams/${examId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Exam deleted successfully");
      fetchExams(); // Refresh the list
    } catch (error) {
      console.error("Error deleting exam:", error);
      alert(error.response?.data?.message || "Failed to delete exam");
    }
  };

  const getExamStatus = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);

    if (now > deadlineDate) {
      return { status: "ended", color: "bg-red-100 text-red-800" };
    } else {
      return { status: "active", color: "bg-green-100 text-green-800" };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
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
        <h1 className="text-2xl font-bold text-gray-900">My Exams</h1>
        <Link to="/teacher/exams/create" className="btn-primary">
          Create New Exam
        </Link>
      </div>

      {exams.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Exams Created
          </h3>
          <p className="text-gray-500 mb-4">
            You haven't created any exams yet.
          </p>
          <Link to="/teacher/exams/create" className="btn-primary">
            Create Your First Exam
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Course</th>
                  <th>Questions</th>
                  <th>Total Marks</th>
                  <th>Duration</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => {
                  const status = getExamStatus(exam.deadline);
                  return (
                    <tr key={exam._id}>
                      <td className="font-medium">{exam.title}</td>
                      <td>{exam.course?.name}</td>
                      <td>{exam.questions.length}</td>
                      <td>{exam.totalMarks}</td>
                      <td>{exam.duration} mins</td>
                      <td>{formatDate(exam.deadline)}</td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
                        >
                          {status.status === "active" ? "Active" : "Ended"}
                        </span>
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          <Link
                            to={`/teacher/exams/${exam._id}/results`}
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                          >
                            Results
                          </Link>
                          <button
                            onClick={() => handleDeleteExam(exam._id)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyExams;

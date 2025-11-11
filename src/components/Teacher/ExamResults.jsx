import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ExamResults = () => {
  const [results, setResults] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [loading, setLoading] = useState(true);
  const { examId } = useParams();

  useEffect(() => {
    fetchExams();
    if (examId) {
      setSelectedExam(examId);
      fetchExamResults(examId);
    }
  }, [examId]);

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

      // If no exam is selected and we have exams, select the first one
      if (!selectedExam && response.data.length > 0) {
        setSelectedExam(response.data[0]._id);
        fetchExamResults(response.data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  const fetchExamResults = async (examId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/teacher/exams/${examId}/results`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setResults(response.data.results);
      setStatistics(response.data.statistics);
    } catch (error) {
      console.error("Error fetching exam results:", error);
      alert("Failed to fetch exam results");
    } finally {
      setLoading(false);
    }
  };

  const handleExamChange = (examId) => {
    setSelectedExam(examId);
    fetchExamResults(examId);
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    if (percentage >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getGrade = (percentage) => {
    if (percentage >= 80) return "A";
    if (percentage >= 60) return "B";
    if (percentage >= 40) return "C";
    return "F";
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
        <h1 className="text-2xl font-bold text-gray-900">Exam Results</h1>
      </div>

      {/* Exam Selector */}
      <div className="bg-white p-4 rounded-lg shadow">
        <label className="form-label">Select Exam</label>
        <select
          value={selectedExam}
          onChange={(e) => handleExamChange(e.target.value)}
          className="form-select"
        >
          <option value="">Choose an exam...</option>
          {exams.map((exam) => (
            <option key={exam._id} value={exam._id}>
              {exam.title} - {exam.course?.name}
            </option>
          ))}
        </select>
      </div>

      {selectedExam && (
        <>
          {/* Statistics */}
          {statistics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {statistics.totalStudents || 0}
                </div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-green-600">
                  {statistics.averageScore
                    ? statistics.averageScore.toFixed(1)
                    : "0"}
                  %
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {statistics.passedStudents || 0}
                </div>
                <div className="text-sm text-gray-600">Passed Students</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {statistics.passRate ? statistics.passRate.toFixed(1) : "0"}%
                </div>
                <div className="text-sm text-gray-600">Pass Rate</div>
              </div>
            </div>
          )}

          {/* Results Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    <th>Score</th>
                    <th>Total Marks</th>
                    <th>Percentage</th>
                    <th>Grade</th>
                    <th>Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {results.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-8 text-gray-500"
                      >
                        No students have taken this exam yet.
                      </td>
                    </tr>
                  ) : (
                    results.map((result) => (
                      <tr key={result._id}>
                        <td className="font-medium">
                          {result.student?.firstName} {result.student?.lastName}
                        </td>
                        <td className="font-mono text-sm">
                          {result.student?.studentId}
                        </td>
                        <td className="font-semibold">{result.score}</td>
                        <td>{result.totalMarks}</td>
                        <td
                          className={`font-bold ${getGradeColor(
                            result.percentage
                          )}`}
                        >
                          {result.percentage.toFixed(1)}%
                        </td>
                        <td
                          className={`font-bold ${getGradeColor(
                            result.percentage
                          )}`}
                        >
                          {getGrade(result.percentage)}
                        </td>
                        <td className="text-sm text-gray-500">
                          {new Date(result.submittedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Analysis */}
          {results.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">
                Performance Analysis
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Score Distribution</span>
                    <span>{statistics.passRate}% Pass Rate</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${statistics.passRate}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Highest Score:</strong>{" "}
                    {Math.max(...results.map((r) => r.percentage)).toFixed(1)}%
                  </div>
                  <div>
                    <strong>Lowest Score:</strong>{" "}
                    {Math.min(...results.map((r) => r.percentage)).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {!selectedExam && exams.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Exams Available
          </h3>
          <p className="text-gray-500">Create an exam first to view results.</p>
        </div>
      )}
    </div>
  );
};

export default ExamResults;

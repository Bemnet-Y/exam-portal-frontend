import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const CreateExam = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    course: "",
    title: "",
    description: "",
    duration: 60,
    deadline: "",
    instructions: "",
    questions: [
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        marks: 1,
      },
    ],
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchCourses();

    // Pre-fill course if provided in URL
    const courseId = searchParams.get("course");
    if (courseId) {
      setFormData((prev) => ({ ...prev, course: courseId }));
    }
  }, [searchParams]);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/teacher/courses",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      alert("Failed to fetch courses");
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];

    if (field === "options") {
      const [optIndex, optValue] = value;
      updatedQuestions[index].options[optIndex] = optValue;
    } else {
      updatedQuestions[index][field] = value;
    }

    setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          marks: 1,
        },
      ],
    }));
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      const updatedQuestions = formData.questions.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.course || !formData.title || !formData.deadline) {
        alert("Please fill all required fields");
        return;
      }

      if (formData.questions.some((q) => !q.questionText.trim())) {
        alert("All questions must have text");
        return;
      }

      if (
        formData.questions.some((q) => q.options.some((opt) => !opt.trim()))
      ) {
        alert("All options must be filled");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/exams",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Exam created successfully!");
      navigate("/teacher/exams");
    } catch (error) {
      console.error("Error creating exam:", error);
      alert(error.response?.data?.message || "Failed to create exam");
    } finally {
      setLoading(false);
    }
  };

  const totalMarks = formData.questions.reduce((sum, q) => sum + q.marks, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Create New Exam
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Exam Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Course *</label>
              <select
                required
                value={formData.course}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, course: e.target.value }))
                }
                className="form-select"
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Exam Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="form-input"
                placeholder="Enter exam title"
              />
            </div>

            <div>
              <label className="form-label">Duration (minutes) *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.duration}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    duration: parseInt(e.target.value),
                  }))
                }
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Deadline *</label>
              <input
                type="datetime-local"
                required
                value={formData.deadline}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, deadline: e.target.value }))
                }
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="form-input"
              rows="3"
              placeholder="Enter exam description"
            />
          </div>

          <div>
            <label className="form-label">Instructions</label>
            <textarea
              value={formData.instructions}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  instructions: e.target.value,
                }))
              }
              className="form-input"
              rows="2"
              placeholder="Enter exam instructions for students"
            />
          </div>

          {/* Questions Section */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Questions</h2>
              <div className="text-sm text-gray-600">
                Total Marks: <span className="font-bold">{totalMarks}</span>
              </div>
            </div>

            {formData.questions.map((question, qIndex) => (
              <div
                key={qIndex}
                className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium">Question {qIndex + 1}</h3>
                  {formData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="form-label">Question Text *</label>
                    <textarea
                      required
                      value={question.questionText}
                      onChange={(e) =>
                        handleQuestionChange(
                          qIndex,
                          "questionText",
                          e.target.value
                        )
                      }
                      className="form-input"
                      rows="2"
                      placeholder="Enter the question"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={question.correctAnswer === oIndex}
                          onChange={() =>
                            handleQuestionChange(
                              qIndex,
                              "correctAnswer",
                              oIndex
                            )
                          }
                          className="text-blue-600"
                        />
                        <input
                          type="text"
                          required
                          value={option}
                          onChange={(e) =>
                            handleQuestionChange(qIndex, "options", [
                              oIndex,
                              e.target.value,
                            ])
                          }
                          className="form-input flex-1"
                          placeholder={`Option ${oIndex + 1}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-4">
                    <div>
                      <label className="form-label">Marks</label>
                      <input
                        type="number"
                        min="1"
                        value={question.marks}
                        onChange={(e) =>
                          handleQuestionChange(
                            qIndex,
                            "marks",
                            parseInt(e.target.value)
                          )
                        }
                        className="form-input w-20"
                      />
                    </div>
                    <div className="text-sm text-gray-500 mt-6">
                      Correct answer:{" "}
                      <span className="font-medium">
                        Option {question.correctAnswer + 1}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition duration-200"
            >
              + Add Another Question
            </button>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/teacher/exams")}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? "Creating Exam..." : "Create Exam"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExam;

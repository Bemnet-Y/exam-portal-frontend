import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentRegistration = () => {
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    college: "",
    department: "",
    year: "",
  });

  useEffect(() => {
    fetchColleges();
  }, []);

  useEffect(() => {
    if (formData.college) {
      fetchDepartments(formData.college);
    } else {
      setDepartments([]);
    }
  }, [formData.college]);

  const fetchColleges = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/colleges`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setColleges(response.data);
    } catch (error) {
      console.error("Error fetching colleges:", error);
    }
  };

  const fetchDepartments = async (collegeId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/colleges/${collegeId}/departments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/students/register`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Student registered successfully!");
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        college: "",
        department: "",
        year: "",
      });
    } catch (error) {
      console.error("FULL ERROR OBJECT:", error);
      console.error("ERROR RESPONSE:", error.response);

      if (error.response?.data) {
        // Show the actual server error message
        const serverError = error.response.data;
        console.error("SERVER ERROR DETAILS:", serverError);

        let errorMessage = "Failed to register student";
        if (serverError.message) {
          errorMessage = serverError.message;
        }
        if (serverError.error) {
          errorMessage += `: ${serverError.error}`;
        }

        alert(`Error: ${errorMessage}`);
      } else if (error.request) {
        alert(
          "No response from server. Please check if the server is running."
        );
      } else {
        alert("An unexpected error occurred: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Register Student
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="student@example.com"
              />
            </div>

            {/* First Name */}
            <div>
              <label className="form-label">First Name *</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter first name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter last name"
              />
            </div>

            {/* College */}
            <div>
              <label className="form-label">College *</label>
              <select
                name="college"
                required
                value={formData.college}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select College</option>
                {colleges.map((college) => (
                  <option key={college._id} value={college._id}>
                    {college.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="form-label">Department *</label>
              <select
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                disabled={!formData.college}
                className="form-select"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {!formData.college && (
                <p className="text-sm text-gray-500 mt-1">
                  Please select a college first
                </p>
              )}
            </div>

            {/* Year */}
            <div>
              <label className="form-label">Year *</label>
              <select
                name="year"
                required
                value={formData.year}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Year</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">
              Default Login Credentials
            </h3>
            <p className="text-blue-700 text-sm">
              The student will receive the default password:{" "}
              <strong>password123</strong>
              <br />
              They will be required to change it on first login.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentRegistration;

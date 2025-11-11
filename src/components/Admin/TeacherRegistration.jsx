import React, { useState } from "react";
import axios from "axios";

const TeacherRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/teachers/register`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Teacher registered successfully!");
      setFormData({ email: "", firstName: "", lastName: "" });
    } catch (error) {
      console.error("FULL ERROR OBJECT:", error);
      console.error("ERROR RESPONSE:", error.response);

      // Show the actual error message from the server
      if (error.response?.data) {
        console.error("SERVER ERROR DETAILS:", error.response.data);
        alert(`Error: ${JSON.stringify(error.response.data, null, 2)}`);
      } else {
        alert("Failed to register teacher. Check console for details.");
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
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Register Teacher
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="md:col-span-2">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="teacher@example.com"
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
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">
              Default Login Credentials
            </h3>
            <p className="text-blue-700 text-sm">
              The teacher will receive the default password:{" "}
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
              {loading ? "Registering..." : "Register Teacher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherRegistration;

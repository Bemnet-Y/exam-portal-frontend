import React, { useState, useEffect } from "react";
import axios from "axios";

const CollegeManagement = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });

  useEffect(() => {
    fetchColleges();
  }, []);

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
      alert("Failed to fetch colleges");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (editingCollege) {
        // Update college
        await axios.put(
          `${import.meta.env.VITE_API_URL}/colleges/${editingCollege._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("College updated successfully");
      } else {
        // Create college
        await axios.post(`${import.meta.env.VITE_API_URL}/colleges`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("College created successfully");
      }

      resetForm();
      fetchColleges();
    } catch (error) {
      console.error("Error saving college:", error);
      alert(error.response?.data?.message || "Failed to save college");
    }
  };

  const handleEdit = (college) => {
    setEditingCollege(college);
    setFormData({
      name: college.name,
      code: college.code,
      description: college.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (collegeId) => {
    if (!window.confirm("Are you sure you want to deactivate this college?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/colleges/${collegeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("College deactivated successfully");
      fetchColleges();
    } catch (error) {
      console.error("Error deleting college:", error);
      alert(error.response?.data?.message || "Failed to deactivate college");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", code: "", description: "" });
    setEditingCollege(null);
    setShowForm(false);
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
        <h1 className="text-2xl font-bold text-gray-900">College Management</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          Add College
        </button>
      </div>

      {/* College Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            {editingCollege ? "Edit College" : "Add New College"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">College Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="form-input"
                  placeholder="Enter college name"
                />
              </div>
              <div>
                <label className="form-label">College Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      code: e.target.value.toUpperCase(),
                    }))
                  }
                  className="form-input"
                  placeholder="Enter college code"
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
                placeholder="Enter college description"
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                {editingCollege ? "Update College" : "Create College"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Colleges Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {colleges.map((college) => (
                <tr key={college._id}>
                  <td className="font-mono font-semibold">{college.code}</td>
                  <td className="font-medium">{college.name}</td>
                  <td className="max-w-xs truncate">{college.description}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        college.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {college.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{new Date(college.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(college)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(college._id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Deactivate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {colleges.length === 0 && !showForm && (
        <div className="text-center py-8">
          <p className="text-gray-500">No colleges found</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary mt-4"
          >
            Add Your First College
          </button>
        </div>
      )}
    </div>
  );
};

export default CollegeManagement;

import React, { useState, useEffect } from "react";
import axios from "axios";

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    college: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [deptsResponse, collegesResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/departments", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/colleges", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setDepartments(deptsResponse.data);
      setColleges(collegesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (editingDept) {
        await axios.put(
          `http://localhost:5000/api/departments/${editingDept._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Department updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/departments", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Department created successfully");
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving department:", error);
      alert(error.response?.data?.message || "Failed to save department");
    }
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      college: dept.college._id,
    });
    setShowForm(true);
  };

  const handleDelete = async (deptId) => {
    if (!window.confirm("Are you sure you want to deactivate this department?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/departments/${deptId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Department deactivated successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting department:", error);
      alert(error.response?.data?.message || "Failed to deactivate department");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", code: "", college: "" });
    setEditingDept(null);
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
        <h1 className="text-2xl font-bold text-gray-900">
          Department Management
        </h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          Add Department
        </button>
      </div>

      {/* Department Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            {editingDept ? "Edit Department" : "Add New Department"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Department Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="form-input"
                  placeholder="Enter department name"
                />
              </div>
              <div>
                <label className="form-label">Department Code *</label>
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
                  placeholder="Enter department code"
                />
              </div>
            </div>
            <div>
              <label className="form-label">College *</label>
              <select
                required
                value={formData.college}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, college: e.target.value }))
                }
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
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                {editingDept ? "Update Department" : "Create Department"}
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

      {/* Departments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>College</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept._id}>
                  <td className="font-mono font-semibold">{dept.code}</td>
                  <td className="font-medium">{dept.name}</td>
                  <td>{dept.college?.name}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        dept.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {dept.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{new Date(dept.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(dept)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(dept._id)}
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

      {departments.length === 0 && !showForm && (
        <div className="text-center py-8">
          <p className="text-gray-500">No departments found</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary mt-4"
          >
            Add Your First Department
          </button>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;

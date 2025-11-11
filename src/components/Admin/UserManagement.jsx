import React, { useState, useEffect } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: "all",
    search: "",
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (filters.role !== "all") params.append("role", filters.role);
      if (filters.search) params.append("search", filters.search);
      params.append("page", filters.page);
      params.append("limit", filters.limit);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/users?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(response.data.users);
      setPagination({
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
        total: response.data.total,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, isActive) => {
    if (
      !window.confirm(
        `Are you sure you want to ${
          isActive ? "deactivate" : "activate"
        } this user?`
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/users/${userId}/status`,
        { isActive: !isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`User ${isActive ? "deactivated" : "activated"} successfully`);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update user status");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
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
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">Role</label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange("role", e.target.value)}
              className="form-select"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>

          <div>
            <label className="form-label">Search</label>
            <input
              type="text"
              placeholder="Search by email..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="form-input"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() =>
                setFilters({ role: "all", search: "", page: 1, limit: 10 })
              }
              className="btn-secondary w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="font-mono text-sm">{user.userId}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "teacher"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleStatusChange(user._id, user.isActive)
                      }
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        user.isActive
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(filters.page - 1) * filters.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(filters.page * filters.limit, pagination.total)}
                  </span>{" "}
                  of <span className="font-medium">{pagination.total}</span>{" "}
                  results
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === pagination.totalPages}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {users.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

import React, { useState, useEffect } from "react";
import axios from "axios";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    college: "",
    department: "",
    year: "",
    teacher: "",
    description: "",
    credits: 3,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.college) {
      fetchDepartments(formData.college);
    } else {
      setDepartments([]);
    }
  }, [formData.college]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [coursesResponse, collegesResponse, teachersResponse] =
        await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/courses`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/colleges`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/admin/teachers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      setCourses(coursesResponse.data);
      setColleges(collegesResponse.data);
      setTeachers(teachersResponse.data.teachers || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data");
    } finally {
      setLoading(false);
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
    try {
      const token = localStorage.getItem("token");

      if (editingCourse) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/courses/${editingCourse._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Course updated successfully");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/courses`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Course created successfully");
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving course:", error);
      alert(error.response?.data?.message || "Failed to save course");
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      code: course.code,
      college: course.college._id,
      department: course.department._id,
      year: course.year.toString(),
      teacher: course.teacher._id,
      description: course.description || "",
      credits: course.credits || 3,
    });
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to deactivate this course?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/courses/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Course deactivated successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting course:", error);
      alert(error.response?.data?.message || "Failed to deactivate course");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      college: "",
      department: "",
      year: "",
      teacher: "",
      description: "",
      credits: 3,
    });
    setEditingCourse(null);
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
        <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          Add Course
        </button>
      </div>

      {/* Course Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            {editingCourse ? "Edit Course" : "Add New Course"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Course Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="form-input"
                  placeholder="Enter course name"
                />
              </div>
              <div>
                <label className="form-label">Course Code *</label>
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
                  placeholder="Enter course code"
                />
              </div>
              <div>
                <label className="form-label">College *</label>
                <select
                  required
                  value={formData.college}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      college: e.target.value,
                    }))
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
              <div>
                <label className="form-label">Department *</label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
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
              </div>
              <div>
                <label className="form-label">Year *</label>
                <select
                  required
                  value={formData.year}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, year: e.target.value }))
                  }
                  className="form-select"
                >
                  <option value="">Select Year</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>
              <div>
                <label className="form-label">Teacher *</label>
                <select
                  required
                  value={formData.teacher}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      teacher: e.target.value,
                    }))
                  }
                  className="form-select"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.firstName} {teacher.lastName} (
                      {teacher.teacherId})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Credits</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.credits}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      credits: parseInt(e.target.value),
                    }))
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
                placeholder="Enter course description"
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                {editingCourse ? "Update Course" : "Create Course"}
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

      {/* Courses Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>College</th>
                <th>Department</th>
                <th>Year</th>
                <th>Teacher</th>
                <th>Credits</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td className="font-mono font-semibold">{course.code}</td>
                  <td className="font-medium">{course.name}</td>
                  <td>{course.college?.name}</td>
                  <td>{course.department?.name}</td>
                  <td>Year {course.year}</td>
                  <td>
                    {course.teacher?.firstName} {course.teacher?.lastName}
                  </td>
                  <td>{course.credits}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {course.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
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

      {courses.length === 0 && !showForm && (
        <div className="text-center py-8">
          <p className="text-gray-500">No courses found</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary mt-4"
          >
            Add Your First Course
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;

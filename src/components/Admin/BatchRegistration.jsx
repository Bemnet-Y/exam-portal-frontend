import React, { useState, useEffect } from "react";
import axios from "axios";

const BatchRegistration = () => {
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadData, setUploadData] = useState({
    college: "",
    department: "",
    year: "",
  });
  const [file, setFile] = useState(null);
  const [uploadResults, setUploadResults] = useState(null);

  useEffect(() => {
    fetchColleges();
  }, []);

  useEffect(() => {
    if (uploadData.college) {
      fetchDepartments(uploadData.college);
    } else {
      setDepartments([]);
    }
  }, [uploadData.college]);

  const fetchColleges = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/colleges", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setColleges(response.data);
    } catch (error) {
      console.error("Error fetching colleges:", error);
    }
  };

  const fetchDepartments = async (collegeId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/colleges/${collegeId}/departments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check if file is Excel
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.oasis.opendocument.spreadsheet",
      ];

      if (
        !validTypes.includes(selectedFile.type) &&
        !selectedFile.name.endsWith(".xlsx")
      ) {
        alert("Please upload an Excel file (.xlsx)");
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    if (!uploadData.college || !uploadData.department || !uploadData.year) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    setUploadResults(null);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("college", uploadData.college);
      formData.append("department", uploadData.department);
      formData.append("year", uploadData.year);

      const response = await axios.post(
        "http://localhost:5000/api/admin/students/batch-register",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadResults(response.data);
      alert("Batch registration completed!");

      // Reset form
      setFile(null);
      document.getElementById("file-upload").value = "";
    } catch (error) {
      console.error("Error during batch registration:", error);
      alert(
        error.response?.data?.message || "Failed to process batch registration"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUploadData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const downloadTemplate = () => {
    // Create sample Excel template data
    const templateData = [
      ["email", "firstName", "lastName"],
      ["student1@example.com", "John", "Doe"],
      ["student2@example.com", "Jane", "Smith"],
      ["student3@example.com", "Mike", "Johnson"],
    ];

    let csvContent = "data:text/csv;charset=utf-8,";
    templateData.forEach((row) => {
      csvContent += row.join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Batch Student Registration
        </h1>

        <div className="space-y-6">
          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Instructions</h3>
            <ul className="text-yellow-700 text-sm list-disc list-inside space-y-1">
              <li>Download the template and fill in student information</li>
              <li>Required columns: email, firstName, lastName</li>
              <li>
                All students will be assigned the same college, department, and
                year
              </li>
              <li>
                Default password for all students: <strong>password123</strong>
              </li>
            </ul>
          </div>

          <button onClick={downloadTemplate} className="btn-secondary">
            Download Excel Template
          </button>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* College */}
              <div>
                <label className="form-label">College *</label>
                <select
                  name="college"
                  required
                  value={uploadData.college}
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
                  value={uploadData.department}
                  onChange={handleChange}
                  disabled={!uploadData.college}
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

              {/* Year */}
              <div>
                <label className="form-label">Year *</label>
                <select
                  name="year"
                  required
                  value={uploadData.year}
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

            {/* File Upload */}
            <div>
              <label className="form-label">Excel File *</label>
              <input
                id="file-upload"
                type="file"
                accept=".xlsx, .xls, .ods"
                onChange={handleFileChange}
                className="form-input"
              />
              <p className="text-sm text-gray-500 mt-1">
                Supported formats: .xlsx, .xls, .ods
              </p>
            </div>

            {/* Upload Results */}
            {uploadResults && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Upload Summary
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {uploadResults.summary.successful}
                    </div>
                    <div className="text-gray-600">Successful</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {uploadResults.summary.failed}
                    </div>
                    <div className="text-gray-600">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {uploadResults.summary.total}
                    </div>
                    <div className="text-gray-600">Total</div>
                  </div>
                </div>

                {uploadResults.errors && uploadResults.errors.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-red-700 mb-2">Errors:</h4>
                    <ul className="text-red-600 text-sm list-disc list-inside space-y-1">
                      {uploadResults.errors.slice(0, 5).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                      {uploadResults.errors.length > 5 && (
                        <li>
                          ... and {uploadResults.errors.length - 5} more errors
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

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
                disabled={loading || !file}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? "Processing..." : "Upload and Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BatchRegistration;

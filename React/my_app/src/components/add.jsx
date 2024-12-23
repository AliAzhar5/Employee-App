import React, { useState } from "react";
import api from "../utils/api";
import { validateField } from "../utils/validatation";

const Add = ({ fetchEmployees, resetForm }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    role: "",
    email: "",
    salary: "",
    city: "",
  });

  const [formErrors, setFormErrors] = useState({
    first_name: "",
    last_name: "",
    role: "",
    email: "",
    salary: "",
    city: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    const error = validateField(name, value);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = Object.keys(formData).every(
      (field) => formErrors[field] === ""
    );

    try {
      if (isValid) {
        const token = localStorage.getItem("authToken");
        await api.post("/employees/", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        fetchEmployees();
        resetForm();
      }
    } catch (error) {
      console.error("An error occurred while adding the employee:", error);
    }
  };

  return (
    <div className="container mt-3">
      <div>
        <h3>Add Employee</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="first_name" className="form-label">
              First Name
            </label>
            <input
              type="text"
              className={`form-control ${
                formErrors.first_name ? "is-invalid" : ""
              }`}
              id="first_name"
              name="first_name"
              onChange={handleChange}
              value={formData.first_name}
            />
            {formErrors.first_name && (
              <div className="invalid-feedback">{formErrors.first_name}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="last_name" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              className={`form-control ${
                formErrors.last_name ? "is-invalid" : ""
              }`}
              id="last_name"
              name="last_name"
              onChange={handleChange}
              value={formData.last_name}
            />
            {formErrors.last_name && (
              <div className="invalid-feedback">{formErrors.last_name}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <input
              type="text"
              className={`form-control ${formErrors.role ? "is-invalid" : ""}`}
              id="role"
              name="role"
              onChange={handleChange}
              value={formData.role}
            />
            {formErrors.role && (
              <div className="invalid-feedback">{formErrors.role}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="text"
              className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
              id="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
            />
            {formErrors.email && (
              <div className="invalid-feedback">{formErrors.email}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="salary" className="form-label">
              Salary
            </label>
            <input
              type="text"
              className={`form-control ${
                formErrors.salary ? "is-invalid" : ""
              }`}
              id="salary"
              name="salary"
              onChange={handleChange}
              value={formData.salary}
            />
            {formErrors.salary && (
              <div className="invalid-feedback">{formErrors.salary}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="city" className="form-label">
              City
            </label>
            <input
              type="text"
              className={`form-control ${formErrors.city ? "is-invalid" : ""}`}
              id="city"
              name="city"
              onChange={handleChange}
              value={formData.city}
            />
            {formErrors.city && (
              <div className="invalid-feedback">{formErrors.city}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary">
            Add Employee
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={resetForm}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add;

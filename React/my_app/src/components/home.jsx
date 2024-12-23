import React, { useState, useEffect } from "react";
import api from "../utils/api";
import Add from "./add";
import Edit from "./edit";

const Home = () => {
  const [employees, setEmployees] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await api.get("/employees/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const resetForm = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentEmployee(null);
  };

  const editEmployee = (employee) => {
    setCurrentEmployee(employee);
    setIsAdding(false);
    setIsEditing(true);
  };

  const deleteEmployee = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    try {
      if (confirm) {
        const token = localStorage.getItem("authToken");
        await api.delete(`/employees/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchEmployees();
      } else {
        console.log("Deletion Canceled");
      }
    } catch (error) {
      console.error("An error occurred while deleting the employee:", error);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <span className="navbar-brand">Employees App</span>
        </div>
      </nav>

      <div className="container mt-3">
        {isAdding ? (
          <Add fetchEmployees={fetchEmployees} resetForm={resetForm} />
        ) : isEditing ? (
          <Edit
            currentEmployee={currentEmployee}
            fetchEmployees={fetchEmployees}
            resetForm={resetForm}
          />
        ) : (
          <div>
            <button
              className="btn btn-primary mb-3"
              onClick={() => setIsAdding(true)}
            >
              Add Employee
            </button>
            <h3>Employee List</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Salary</th>
                  <th>City</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td>{employee.first_name}</td>
                    <td>{employee.last_name}</td>
                    <td>{employee.role}</td>
                    <td>{employee.email}</td>
                    <td>{employee.salary}</td>
                    <td>{employee.city}</td>
                    <td>
                      <button
                        className="btn btn-warning me-2"
                        onClick={() => editEmployee(employee)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteEmployee(employee.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

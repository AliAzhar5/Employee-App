export const validateField = (name, value) => {
  let error = "";

  const stringvalue = typeof value === "string" ? value.trim() : String(value);

  switch (name) {
    case "first_name":
      if (!stringvalue) error = "First name is required.";
      else if (!/^[A-Za-z\s]+$/.test(value))
        error = "First name can only contain letters.";
      break;

    case "last_name":
      if (!stringvalue) error = "Last name is required.";
      else if (!/^[A-Za-z\s]+$/.test(value))
        error = "Last name can only contain letters.";
      break;

    case "role":
      if (!stringvalue) error = "Role is required.";
      else if (!/^[A-Za-z\s]+$/.test(value))
        error = "Role can only contain letters.";
      break;

    case "email":
      if (!stringvalue) error = "Email is required.";
      else if (!/^[a-zA-Z]+[\w.-]*@[a-zA-Z]+\.[a-zA-Z]{2,7}$/.test(value))
        error = "Please enter a valid email address.";
      break;

    case "salary":
      if (value === "" || value === null || value === undefined)
        error = "Salary is required.";
      else if (isNaN(value) || parseInt(value, 10) <= 0)
        error = "Salary must be a positive number.";
      break;

    case "city":
      if (!value.trim()) error = "City is required.";
      else if (!/^[A-Za-z\s]+$/.test(value))
        error = "City can only contain letters.";
      break;

    default:
      break;
  }

  return error;
};

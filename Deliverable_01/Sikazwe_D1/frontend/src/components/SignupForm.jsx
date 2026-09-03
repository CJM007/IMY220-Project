import { useState } from "react";

function SignupForm({ onSignup }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSignup(formData);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="auth-form">
      <div className="field">
        <label htmlFor="signup-username">Username</label>
        <input
          id="signup-username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <p className="error-text">{errors.username}</p>}
      </div>

      <div className="field">
        <label htmlFor="signup-email">Email address</label>
        <input
          id="signup-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>

      <div className="field">
        <label htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}
      </div>

      <div className="field">
        <label htmlFor="signup-confirm">Confirm password</label>
        <input
          id="signup-confirm"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <p className="error-text">{errors.confirmPassword}</p>
        )}
      </div>

      <button type="submit">Sign up</button>
    </form>
  );
}

export default SignupForm;

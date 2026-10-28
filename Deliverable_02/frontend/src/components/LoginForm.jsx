import { useState } from "react";

export default function LoginForm({ onSubmit, error, pending }) {
  const [fields, setFields] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};
    if (!fields.email.trim()) next.email = "Email is required.";
    if (!fields.password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(fields);
  }

  function handleChange(e) {
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-label="Log in">
      <div>
        <label htmlFor="login-email" className="label">Email</label>
        <input
          id="login-email"
          name="email"
          type="email"
          className="input-field"
          value={fields.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="login-password" className="label">Password</label>
        <input
          id="login-password"
          name="password"
          type="password"
          className="input-field"
          value={fields.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}
      </div>
      {error && <p className="error-text">{error}</p>}
      <button type="submit" className="btn-primary w-full" disabled={pending}>
        {pending ? "Signing in..." : "Log in"}
      </button>
    </form>
  );
}

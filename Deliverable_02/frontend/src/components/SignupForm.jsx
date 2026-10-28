import { useState } from "react";

export default function SignupForm({ onSubmit, error, pending }) {
  const [fields, setFields] = useState({ username: "", email: "", password: "", bio: "" });
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};
    if (!fields.username.trim()) next.username = "Username is required.";
    if (!fields.email.trim()) next.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(fields.email)) next.email = "Enter a valid email address.";
    if (!fields.password) next.password = "Password is required.";
    else if (fields.password.length < 6) next.password = "Password must be at least 6 characters.";
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
    <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-label="Register">
      <div>
        <label htmlFor="signup-username" className="label">Username</label>
        <input
          id="signup-username"
          name="username"
          type="text"
          className="input-field"
          value={fields.username}
          onChange={handleChange}
        />
        {errors.username && <p className="error-text">{errors.username}</p>}
      </div>
      <div>
        <label htmlFor="signup-email" className="label">Email</label>
        <input
          id="signup-email"
          name="email"
          type="email"
          className="input-field"
          value={fields.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="signup-password" className="label">Password</label>
        <input
          id="signup-password"
          name="password"
          type="password"
          className="input-field"
          value={fields.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}
      </div>
      <div>
        <label htmlFor="signup-bio" className="label">Bio (optional)</label>
        <textarea
          id="signup-bio"
          name="bio"
          className="input-field"
          rows={2}
          value={fields.bio}
          onChange={handleChange}
        />
      </div>
      {error && <p className="error-text">{error}</p>}
      <button type="submit" className="btn-primary w-full" disabled={pending}>
        {pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}

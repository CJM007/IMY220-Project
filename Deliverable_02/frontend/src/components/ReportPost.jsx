import { useState } from "react";

// Predefined reasons — per the main spec, only admins can add new ones,
// and admin functionality is explicitly out of scope for D2, so this is a
// fixed list for now rather than something stored/editable in the database.
const REPORT_REASONS = [
  "Spam or misleading",
  "Inappropriate content",
  "Harassment",
  "Not actually about a book",
  "Other",
];

function ReportPost({ onReport }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await onReport(reason);
      setSubmitted(true);
      setIsOpen(false);
    } catch (err) {
      setError(err.message);
    }
  }

  if (submitted) {
    return <p>Thanks — this post has been reported.</p>;
  }

  if (!isOpen) {
    return <button onClick={() => setIsOpen(true)}>Report post</button>;
  }

  return (
    <form onSubmit={handleSubmit} className="report-form">
      {error && <p className="error-text">{error}</p>}

      <label htmlFor="report-reason">Why are you reporting this post?</label>
      <select
        id="report-reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      >
        {REPORT_REASONS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      <button type="submit">Submit report</button>
      <button type="button" onClick={() => setIsOpen(false)}>
        Cancel
      </button>
    </form>
  );
}

export default ReportPost;

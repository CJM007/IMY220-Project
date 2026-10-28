import { useEffect, useState } from "react";
import { getReasons } from "../api.js";

export default function ReportPost({ postId, onReport }) {
  const [reasons, setReasons] = useState([]);
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      getReasons()
        .then((data) => setReasons(data.reasons))
        .catch((err) => setError(err.message));
    }
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selected) {
      setError("Choose a reason first.");
      return;
    }
    try {
      await onReport(postId, selected);
      setMessage("Thanks, this post has been reported.");
      setError("");
      setOpen(false);
    } catch (err) {
      setError(err.message);
    }
  }

  if (message) {
    return <p className="text-sm text-olive">{message}</p>;
  }

  if (!open) {
    return (
      <button className="text-sm text-error hover:underline" onClick={() => setOpen(true)}>
        Report this post
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card mt-2 space-y-2">
      <label htmlFor="report-reason" className="label">Why are you reporting this post?</label>
      <select
        id="report-reason"
        className="input-field"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        <option value="">Choose a reason...</option>
        {reasons.map((r) => (
          <option key={r._id} value={r._id}>{r.text}</option>
        ))}
      </select>
      {error && <p className="error-text">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" className="btn-danger text-sm">Submit report</button>
        <button type="button" className="btn-secondary text-sm" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </form>
  );
}

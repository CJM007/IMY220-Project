import { useState } from "react";

function EditProfile({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: user.name,
    pronouns: user.pronouns,
    bio: user.bio,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="edit-profile-form">
      <label htmlFor="name">Name</label>
      <input
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />

      <label htmlFor="pronouns">Pronouns</label>
      <input
        id="pronouns"
        name="pronouns"
        value={formData.pronouns}
        onChange={handleChange}
      />

      <label htmlFor="bio">Bio</label>
      <textarea
        id="bio"
        name="bio"
        value={formData.bio}
        onChange={handleChange}
      />

      <button type="submit">Save changes</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}

export default EditProfile;

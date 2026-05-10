function ProfileSettingsForm({
  profileForm,
  setProfileForm,
  onImageUpload,
  onSave,
  onDeleteAccount,
}) {
  return (
    <form className="panel-card stack-form" onSubmit={onSave}>
      <label className="field-group">
        <span>Name</span>
        <input
          type="text"
          value={profileForm.name}
          onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })}
        />
      </label>
      <label className="field-group">
        <span>Email</span>
        <input
          type="email"
          value={profileForm.email}
          onChange={(event) => setProfileForm({ ...profileForm, email: event.target.value })}
        />
      </label>
      <label className="field-group">
        <span>Language preference</span>
        <select
          value={profileForm.language}
          onChange={(event) => setProfileForm({ ...profileForm, language: event.target.value })}
        >
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="French">French</option>
        </select>
      </label>
      <label className="field-group">
        <span>Profile photo</span>
        <input type="file" accept="image/*" onChange={onImageUpload} />
      </label>
      <label className="field-group">
        <span>Bio</span>
        <textarea
          rows="5"
          value={profileForm.bio}
          onChange={(event) => setProfileForm({ ...profileForm, bio: event.target.value })}
        />
      </label>
      <div className="inline-actions">
        <button type="submit" className="site-button site-button-primary">
          Save Settings
        </button>
        <button type="button" className="site-button site-button-danger" onClick={onDeleteAccount}>
          Delete Account
        </button>
      </div>
    </form>
  )
}

export default ProfileSettingsForm

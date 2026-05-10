function AuthFields({ mode, formState, errors, onChange }) {
  return (
    <>
      {mode === 'signup' && (
        <label className="field-group">
          <span>Name</span>
          <input
            type="text"
            name="name"
            value={formState.name}
            onChange={onChange}
            placeholder="Mr. Traveller"
          />
          {errors.name && <small className="field-error">{errors.name}</small>}
        </label>
      )}

      <label className="field-group">
        <span>Email</span>
        <input
          type="email"
          name="email"
          value={formState.email}
          onChange={onChange}
          placeholder="traveller@travelloop.com"
        />
        {errors.email && <small className="field-error">{errors.email}</small>}
      </label>

      <label className="field-group">
        <span>Password</span>
        <input
          type="password"
          name="password"
          value={formState.password}
          onChange={onChange}
          placeholder="Enter your password"
        />
        {errors.password && <small className="field-error">{errors.password}</small>}
      </label>
    </>
  )
}

export default AuthFields

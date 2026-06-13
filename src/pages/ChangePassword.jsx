import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
export function ChangePassword() {
  const { user, applyProfileUpdate } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    const updates = {};
    if (newPassword) {
      updates.currentPassword = currentPassword;
      updates.newPassword = newPassword;
    }

    if (!Object.keys(updates).length) {
      setError('Nothing to update');
      return;
    }

    try {
      const data = await api.updateProfile(updates);
      applyProfileUpdate(data);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess('Profile updated.');
    } catch (err) {
      setError(err.message);
    }
  }
return <div className="page">
      <header className="topbar">
        <h1>שינוי סיסמא</h1>
        <Link to="/">
          <button className="secondary">Back</button>
        </Link>
      </header>

<section className="card">
<form
          onSubmit={async (e) => {
            handleSubmit(e)
          }}
        >
          <h3>Change password</h3>
          <label>
            Current password
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          <label>
            New password
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>
          <label>
            Confirm new password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit">Save changes</button>
        </form>
      </section>
    </div>
}
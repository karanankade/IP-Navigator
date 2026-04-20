import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/users/profile', { name, email });
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/users/change-password', { currentPassword, newPassword });
      setPwdMsg('Password updated!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPwdMsg(err.response?.data?.error || 'Failed to update password');
    }
  };

  return (
    <div className="py-8 max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <UserIcon className="w-8 h-8 text-primary-500" />
        <h1 className="text-3xl font-bold">Profile Settings</h1>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Account Information</h2>
        {message && <div className="p-3 mb-4 rounded bg-primary-50 text-primary-600">{message}</div>}
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="input-field" required />
          </div>
          <button type="submit" className="btn-primary">Save Changes</button>
        </form>
      </div>

      <div className="card border-red-500/20">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        {pwdMsg && <div className="p-3 mb-4 rounded bg-slate-100 text-[var(--text-secondary)]">{pwdMsg}</div>}
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <input type="password" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} className="input-field" required />
          </div>
          <button type="submit" className="btn-secondary">Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

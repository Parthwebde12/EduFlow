import  { useState } from 'react';
import { Camera, Save, Key, User, BookOpen, Tag, Building } from 'lucide-react';
import { useAuth } from '../context/Authcontext';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    college: user?.college || '',
    skills: user?.skills?.join(', ') || '',
  });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [savingPw, setSavingPw] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/users/profile', form);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoUploading(true);
    try {
      const fd = new FormData();
      fd.append('photo', file);
      const res = await api.put('/users/profile/photo', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateUser(res.data.user);
      toast.success('Photo updated!');
    } catch {
      toast.error('Failed to upload photo');
    } finally {
      setPhotoUploading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) {
      return toast.error('New passwords do not match');
    }
    if (pwForm.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setSavingPw(true);
    try {
      await api.put('/users/password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword
      });
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      
      <div className="card p-6 flex items-center gap-5">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-primary-400 to-accent-400 flex items-center justify-center overflow-hidden">
            {user?.profilePhoto?.url ? (
              <img src={user.profilePhoto.url} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-3xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 hover:bg-primary-700 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
            {photoUploading ? <LoadingSpinner size="sm" /> : <Camera size={13} className="text-white" />}
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </label>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.email}</p>
          {user?.college && <p className="text-primary-600 dark:text-primary-400 text-sm mt-0.5">{user.college}</p>}
        </div>
      </div>

      
      <div className="card p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <User size={18} className="text-primary-500" /> Edit Profile
        </h3>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><Building size={13} /> College / University</label>
            <input className="input" placeholder="Your university..." value={form.college}
              onChange={e => setForm(f => ({ ...f, college: e.target.value }))} />
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><BookOpen size={13} /> Bio</label>
            <textarea className="input resize-none" rows={3} placeholder="Tell the community about yourself..."
              value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} maxLength={200} />
            <p className="text-xs text-slate-400 mt-1">{form.bio.length}/200</p>
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><Tag size={13} /> Skills (comma-separated)</label>
            <input className="input" placeholder="e.g. Python, Machine Learning, Data Analysis"
              value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <LoadingSpinner size="sm" /> : <><Save size={15} /> Save Changes</>}
          </button>
        </form>
      </div>

      
      {user?.skills?.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Your Skills</h3>
          <div className="flex flex-wrap gap-2">
            {user.skills.map(skill => (
              <span key={skill} className="badge bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-3 py-1 text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      
      <div className="card p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Key size={18} className="text-accent-500" /> Change Password
        </h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="label">Current Password</label>
            <input type="password" className="input" value={pwForm.currentPassword}
              onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))} required />
          </div>
          <div>
            <label className="label">New Password</label>
            <input type="password" className="input" placeholder="Min. 6 characters" value={pwForm.newPassword}
              onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <input type="password" className="input" value={pwForm.confirm}
              onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} required />
          </div>
          <button type="submit" disabled={savingPw} className="btn-primary flex items-center gap-2">
            {savingPw ? <LoadingSpinner size="sm" /> : <><Key size={15} /> Update Password</>}
          </button>
        </form>
      </div>
    </div>
  );
}

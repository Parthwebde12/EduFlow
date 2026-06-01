import { useState, useEffect, useCallback } from 'react';
import {
  BookOpen, Plus, Search, Heart, Trash2, ExternalLink,
  Link2, FileText, 
} from 'lucide-react';
import { resourcesService } from '../services/resources';
import { useAuth } from '../context/Authcontext';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { format } from 'date-fns';

const CATEGORIES = [
  'All', 'Textbooks', 'Lecture Slides', 'Research Papers',
  'Practice Problems', 'Cheat Sheets', 'Videos', 'Websites', 'Tools', 'Other'
];

const CATEGORY_COLORS = {
  'Textbooks': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Lecture Slides': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Research Papers': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Practice Problems': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'Cheat Sheets': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'Videos': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  'Websites': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  'Tools': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Other': 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
};

export default function ResourcesPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [modal, setModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: 'Other', subject: '',
    tags: '', resourceType: 'link', link: '', isPublic: true, file: null
  });

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const res = await resourcesService.getAll(params);
      setResources(res.data.resources);
    } catch {
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    const timer = setTimeout(fetchResources, 300);
    return () => clearTimeout(timer);
  }, [fetchResources]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k !== 'file' && v !== null) fd.append(k, v);
      });
      if (form.resourceType === 'file' && form.file) {
        fd.append('file', form.file);
      }

      const res = await resourcesService.create(fd);
      toast.success(res.data.message);
      setResources(prev => [res.data.resource, ...prev]);
      setModal(false);
      setForm({
        title: '', description: '', category: 'Other', subject: '',
        tags: '', resourceType: 'link', link: '', isPublic: true, file: null
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to share resource');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (resource) => {
    try {
      const res = await resourcesService.toggleLike(resource._id);
      setResources(prev => prev.map(r => r._id === resource._id
        ? {
          ...r,
          likes: res.data.liked
            ? [...r.likes, user._id]
            : r.likes.filter(id => id !== user._id)
        }
        : r
      ));
    } catch {
      toast.error('Failed to like resource');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource?')) return;
    try {
      await resourcesService.delete(id);
      toast.success('Resource deleted');
      setResources(prev => prev.filter(r => r._id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Resources</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Shared study materials</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Share Resource
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Search resources..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              category === cat
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resources grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <LoadingSpinner size="lg" />
        </div>
      ) : resources.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No resources found"
          description="Share the first resource with your study community!"
          action={
            <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Share Resource
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map(r => {
            const isOwner = r.owner?._id === user?._id || r.owner === user?._id;
            const isLiked = r.likes?.includes(user?._id);

            return (
              <div key={r._id} className="card-hover p-4 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <span className={`badge text-xs ${CATEGORY_COLORS[r.category] || CATEGORY_COLORS['Other']}`}>
                    {r.category}
                  </span>
                  <div className="flex items-center gap-1">
                    {r.resourceType === 'link'
                      ? <Link2 size={14} className="text-slate-400" />
                      : <FileText size={14} className="text-slate-400" />
                    }
                  </div>
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1 line-clamp-2">
                  {r.title}
                </h3>
                <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">{r.subject}</p>

                {r.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">{r.description}</p>
                )}

                {r.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {r.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="badge bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto pt-2 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <div className="flex items-center gap-1">
                      {r.owner?.profilePhoto?.url ? (
                        <img src={r.owner.profilePhoto.url} alt="" className="w-4 h-4 rounded-full" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                          <span className="text-white" style={{ fontSize: 8 }}>
                            {r.owner?.name?.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span>{r.owner?.name || 'Unknown'}</span>
                    </div>
                    <span>{format(new Date(r.createdAt), 'MMM d')}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Open/view */}
                    {r.resourceType === 'link' ? (
                      <a
                        href={r.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 btn-secondary flex items-center justify-center gap-1.5 py-1.5 text-xs"
                      >
                        <ExternalLink size={13} /> Visit
                      </a>
                    ) : (
                      <a
                        href={r.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 btn-secondary flex items-center justify-center gap-1.5 py-1.5 text-xs"
                      >
                        <ExternalLink size={13} /> Open
                      </a>
                    )}

                    {/* Like */}
                    <button
                      onClick={() => handleLike(r)}
                      className={`btn-ghost px-2.5 py-1.5 flex items-center gap-1 text-xs ${
                        isLiked ? 'text-red-500' : 'text-slate-400'
                      }`}
                    >
                      <Heart size={13} className={isLiked ? 'fill-red-500' : ''} />
                      {r.likes?.length || 0}
                    </button>

                    {/* Delete (owner only) */}
                    {isOwner && (
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="btn-ghost px-2 py-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Resource Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title="Share a Resource">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input className="input" placeholder="e.g. MIT OpenCourseWare - Linear Algebra"
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Category *</label>
              <select className="input" value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Subject *</label>
              <input className="input" placeholder="e.g. Mathematics"
                value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required />
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={2} placeholder="What is this resource about?"
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>

          <div>
            <label className="label">Type</label>
            <div className="flex gap-3">
              {['link', 'file'].map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="resourceType" value={type}
                    checked={form.resourceType === type}
                    onChange={e => setForm(f => ({ ...f, resourceType: e.target.value }))}
                    className="accent-primary-600"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {type === 'link' ? 'URL Link' : 'Upload File'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {form.resourceType === 'link' ? (
            <div>
              <label className="label">URL *</label>
              <input className="input" type="url" placeholder="https://..."
                value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} required />
            </div>
          ) : (
            <div>
              <label className="label">File *</label>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx"
                onChange={e => setForm(f => ({ ...f, file: e.target.files[0] }))}
                className="input cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 file:text-sm" />
            </div>
          )}

          <div>
            <label className="label">Tags (comma-separated)</label>
            <input className="input" placeholder="e.g. free, video, beginner"
              value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isPublic}
              onChange={e => setForm(f => ({ ...f, isPublic: e.target.checked }))}
              className="w-4 h-4 rounded accent-primary-600" />
            <span className="text-sm text-slate-600 dark:text-slate-300">Make this resource public</span>
          </label>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {submitting ? <LoadingSpinner size="sm" /> : <><Plus size={15} /> Share</>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

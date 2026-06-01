import  { useState, useEffect, useCallback } from 'react';
import {
  FileText, Upload, Download, Trash2, Search,
  Plus, Image, FileBadge, Eye
} from 'lucide-react';
import { notesService } from '../services/notes';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { format } from 'date-fns';

const formatFileSize = (bytes) => {
  if (!bytes) return 'Unknown size';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [uploadModal, setUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', subject: '', tags: '', isPublic: false, file: null
  });

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (subject) params.subject = subject;
      const res = await notesService.getAll(params);
      setNotes(res.data.notes);
    } catch {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [search, subject]);

  useEffect(() => {
    const timer = setTimeout(fetchNotes, 300);
    return () => clearTimeout(timer);
  }, [fetchNotes]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.file) return toast.error('Please select a file');

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', form.file);
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('subject', form.subject);
      fd.append('tags', form.tags);
      fd.append('isPublic', form.isPublic);

      const res = await notesService.upload(fd);
      toast.success(res.data.message);
      setNotes(prev => [res.data.note, ...prev]);
      setUploadModal(false);
      setForm({ title: '', description: '', subject: '', tags: '', isPublic: false, file: null });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (note) => {
    try {
      const res = await notesService.download(note._id);
      window.open(res.data.downloadUrl, '_blank');
      setNotes(prev => prev.map(n => n._id === note._id ? { ...n, downloads: n.downloads + 1 } : n));
    } catch {
      toast.error('Download failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note? This cannot be undone.')) return;
    try {
      await notesService.delete(id);
      toast.success('Note deleted');
      setNotes(prev => prev.filter(n => n._id !== id));
    } catch {
      toast.error('Failed to delete note');
    }
  };

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Notes</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{notes.length} note{notes.length !== 1 ? 's' : ''} uploaded</p>
        </div>
        <button onClick={() => setUploadModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Upload Note
        </button>
      </div>

      {/* Search & filter */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>
        <input
          type="text"
          placeholder="Filter by subject..."
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className="input w-48"
        />
      </div>

      {/* Notes grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <LoadingSpinner size="lg" />
        </div>
      ) : notes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No notes yet"
          description="Upload your first note to get started. PDFs and images are supported."
          action={
            <button onClick={() => setUploadModal(true)} className="btn-primary flex items-center gap-2">
              <Upload size={16} /> Upload Note
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {notes.map(note => (
            <div key={note._id} className="card-hover p-4 flex flex-col">
              {/* File type icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                note.file.fileType === 'pdf'
                  ? 'bg-red-100 dark:bg-red-900/30'
                  : 'bg-blue-100 dark:bg-blue-900/30'
              }`}>
                {note.file.fileType === 'pdf'
                  ? <FileBadge size={18} className="text-red-600 dark:text-red-400" />
                  : <Image size={18} className="text-blue-600 dark:text-blue-400" />
                }
              </div>

              <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1 line-clamp-2">{note.title}</h3>
              <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">{note.subject}</p>
              {note.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">{note.description}</p>
              )}

              {/* Tags */}
              {note.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {note.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-auto pt-2 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>{formatFileSize(note.file.size)}</span>
                  <span>{format(new Date(note.createdAt), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDownload(note)}
                    className="flex-1 btn-secondary flex items-center justify-center gap-1.5 py-1.5 text-xs"
                  >
                    <Download size={13} />
                    Download
                  </button>
                  <a
                    href={note.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost px-2 py-1.5 text-xs"
                  >
                    <Eye size={13} />
                  </a>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="btn-ghost px-2 py-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="text-xs text-slate-400 mt-1.5 text-center">
                  {note.downloads} download{note.downloads !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal isOpen={uploadModal} onClose={() => setUploadModal(false)} title="Upload Note">
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input
              className="input"
              placeholder="e.g. Calculus Chapter 3 Notes"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="label">Subject *</label>
            <input
              className="input"
              placeholder="e.g. Mathematics, Physics, CS101"
              value={form.subject}
              onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="input resize-none"
              rows={2}
              placeholder="Brief description of the notes..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div>
            <label className="label">Tags (comma-separated)</label>
            <input
              className="input"
              placeholder="e.g. exam, chapter3, formulas"
              value={form.tags}
              onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
            />
          </div>

          <div>
            <label className="label">File * (PDF or Image, max 10MB)</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={e => setForm(f => ({ ...f, file: e.target.files[0] }))}
              className="input cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 file:text-sm"
              required
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isPublic}
              onChange={e => setForm(f => ({ ...f, isPublic: e.target.checked }))}
              className="w-4 h-4 rounded accent-primary-600"
            />
            <span className="text-sm text-slate-600 dark:text-slate-300">Make this note public</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setUploadModal(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {uploading ? <LoadingSpinner size="sm" /> : <><Upload size={15} /> Upload</>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

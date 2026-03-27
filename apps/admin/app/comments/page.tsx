'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function CommentsPage() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadComments();
  }, []);

  async function loadComments() {
    const { data } = await supabase
      .from('comments')
      .select('*, videos(title)')
      .order('published_at', { ascending: false });
    setComments(data || []);
    setLoading(false);
  }

  async function deleteComment(id: string) {
    if (!confirm('Delete this comment?')) return;
    await supabase.from('comments').delete().eq('id', id);
    loadComments();
  }

  async function saveComment() {
    if (!editingId) return;
    const { error } = await supabase
      .from('comments')
      .update({
        author_name: editData.author_name,
        content: editData.content,
        like_count: Number(editData.like_count),
        is_hearted: editData.is_hearted,
        is_pinned: editData.is_pinned,
        status: editData.status,
      })
      .eq('id', editingId);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setEditingId(null);
      setMessage('Comment updated!');
      loadComments();
    }
  }

  function startEdit(comment: any) {
    setEditingId(comment.id);
    setEditData({ ...comment });
  }

  if (loading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Comments</h1>

      {message && (
        <div className="mb-4 p-3 rounded-lg text-sm bg-green-900/50 text-green-300">{message}</div>
      )}

      <div className="space-y-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4"
          >
            {editingId === comment.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Author</label>
                    <input
                      type="text"
                      value={editData.author_name}
                      onChange={(e) => setEditData({ ...editData, author_name: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Status</label>
                    <select
                      value={editData.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="published">Published</option>
                      <option value="held_for_review">Held for Review</option>
                      <option value="spam">Spam</option>
                      <option value="removed">Removed</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Content</label>
                  <textarea
                    value={editData.content}
                    onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                    rows={2}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="number"
                      value={editData.like_count}
                      onChange={(e) => setEditData({ ...editData, like_count: e.target.value })}
                      className="w-20 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                    />
                    Likes
                  </label>
                  <label className="flex items-center gap-1 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={editData.is_hearted}
                      onChange={(e) => setEditData({ ...editData, is_hearted: e.target.checked })}
                    />
                    Hearted
                  </label>
                  <label className="flex items-center gap-1 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={editData.is_pinned}
                      onChange={(e) => setEditData({ ...editData, is_pinned: e.target.checked })}
                    />
                    Pinned
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={saveComment}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-sm font-medium">{comment.author_name}</span>
                    <span className="text-gray-500 text-xs">
                      on {comment.videos?.title}
                    </span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        comment.status === 'published'
                          ? 'bg-green-900/50 text-green-300'
                          : comment.status === 'held_for_review'
                          ? 'bg-yellow-900/50 text-yellow-300'
                          : 'bg-red-900/50 text-red-300'
                      }`}
                    >
                      {comment.status}
                    </span>
                    {comment.is_pinned && <span className="text-xs text-blue-400">📌</span>}
                    {comment.is_hearted && <span className="text-xs">❤️</span>}
                  </div>
                  <p className="text-gray-300 text-sm">{comment.content}</p>
                  <div className="text-gray-500 text-xs mt-1">
                    👍 {comment.like_count} · {new Date(comment.published_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => startEdit(comment)}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

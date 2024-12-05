import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';

interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

interface CommentsProps {
  modelId: string;
}

export function Comments({ modelId }: CommentsProps) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment,
      author: user?.username || 'Anonymous',
      createdAt: new Date().toISOString(),
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <div className="mt-2 flex justify-end">
            <Button type="submit">
              Post Comment
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium text-gray-900">{comment.author}</span>
              <span className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-600">{comment.text}</p>
          </div>
        ))}
        
        {comments.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}
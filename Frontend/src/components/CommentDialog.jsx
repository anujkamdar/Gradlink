import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from './ui/button';
import { Loader2, SendHorizontal } from 'lucide-react';

export default function CommentDialog({ isOpen, onClose, postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && postId) {
      fetchComments();
    }
  }, [isOpen, postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:8000/gradlink/api/v1/users/get-comments',
        { postId },
        { withCredentials: true }
      );
      setComments(response.data.data);
      console.log(response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setLoading(false);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await axios.post(
        'http://localhost:8000/gradlink/api/v1/users/add-comment',
        { 
          content: newComment,
          postId 
        },
        { withCredentials: true }
      );
      
      setNewComment('');
      fetchComments();
      setSubmitting(false);
    } catch (error) {
      console.error('Error submitting comment:', error);
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        
        <div className="p-4 max-h-[60vh] flex flex-col">
          {/* Comments list */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="flex space-x-3 p-3 border-b border-gray-100">
                  <img
                    src={comment.postedByDetails.avatar}
                    alt={comment.postedByDetails.fullname}
                    className="h-8 w-8 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{comment.postedByDetails.fullname}</h4>
                      <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-700 mt-1">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
          
          {/* Comment input form */}
          <form onSubmit={submitComment} className="mt-auto">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={submitting}
              />
              <Button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className={`flex items-center ${
                  submitting || !newComment.trim() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <SendHorizontal className="h-4 w-4 mr-2" />
                )}
                Post
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

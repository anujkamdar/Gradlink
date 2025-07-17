import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { MessageCircle, Heart, Image, Video, Send, ThumbsUp, X, PenSquare, Trash2, UserCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from "./ui/dialog";
import axios from "axios";
import { Backend_url } from "../info.js";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import Linkify from "linkify-react";
import CommentDialog from "./CommentDialog";
import TimeAgo from "react-timeago";

export default function PostsPage() {
    const [category, setCategory] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [showNewPostDialog, setShowNewPostDialog] = useState(false);
    const [posts, setPosts] = useState([]);
    const [showOnlyMyPosts, setShowOnlyMyPosts] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [newPostForm, setNewPostForm] = useState({
        content: "",
        category: "",
        media: null // This will hold the file object for media uploads
    });
    const [submitting, setSubmitting] = useState(false);
    const [likeInProgress, setLikeInProgress] = useState(false);
    const [activeCommentPostId, setActiveCommentPostId] = useState(null);
    const [showCommentDialog, setShowCommentDialog] = useState(false);


    const hyperLinkOptions = {
        target: "_blank",
        rel: "noopener noreferrer",
        className: "text-blue-600"
    };


    const submitNewPost = async (e) => {
        e.preventDefault()
        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append("content", newPostForm.content);
            formData.append("category", newPostForm.category);
            if (newPostForm.media) {
                formData.append("media", newPostForm.media);
            }
            const response = await axios.post(`${Backend_url}/gradlink/api/v1/users/create-post`, formData, { withCredentials: true })
            console.log(response.data);
            setSubmitting(false);
            setShowNewPostDialog(false);
            setNewPostForm({
                content: "",
                category: "",
                media: null
            });
            window.location.reload();
        } catch (error) {
            console.error("Error creating post:", error);
        }
    }

    const likePost = async (postId) => {
        if (likeInProgress) return;

        try {
            setLikeInProgress(true);
            const response = await axios.post(
                `${Backend_url}/gradlink/api/v1/users/toggle-like`,
                { postId },
                { withCredentials: true }
            );

            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === postId ? {
                        ...post,
                        likesCount: response.data.data.likes.length,
                        isLikedByUser: !post.isLikedByUser
                    }
                        : post
                )
            );

        } catch (error) {
            console.error("Error toggling like:", error);
        } finally {
            setLikeInProgress(false);
        }
    };

    const getPosts = async () => {
        try {
            const response = await axios.post(
                `${Backend_url}/gradlink/api/v1/users/get-posts`,
                { category, myPostsOnly: showOnlyMyPosts },
                { withCredentials: true }
            );
            console.log(response.data.data.docs);
            setTotalPages(response.data?.data.totalPages)
            setPosts(response.data.data.docs);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setLoading(false);
        }
    }

    const deletePost = async (postId) => {
        try {
            setSubmitting(true);
            const response = await axios.post(
                `${Backend_url}/gradlink/api/v1/users/delete-post`,
                { postId },
                { withCredentials: true }
            );

            if (response.data.success) {
                setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
                setShowDeleteDialog(false);
                setPostToDelete(null);
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        getPosts();
    }, [category, showCommentDialog, showOnlyMyPosts])

    if (loading) {
        return (
            <div className="container mx-auto py-10 flex justify-center">
                <div className="animate-pulse flex flex-col space-y-4 w-full max-w-3xl">
                    <div className="h-10 bg-gray-200 rounded  mb-4"></div>
                    {[1, 2, 3].map((_, index) => (
                        <div key={index} className="h-60 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    const categories = [
        { id: "", label: "All Posts" },
        { id: "success", label: "Success Stories" },
        { id: "event", label: "Events" },
        { id: "career", label: "Career" },
        { id: "project showcase", label: "Project Showcase" },
        { id: "college news", label: "College News" }
    ];

    const handleCategoryChange = (categoryId) => {
        setCategory(categoryId);
        setCurrentPage(1); // Reset to first page when changing category
    };

    return (
        <div className="bg-gray-50 min-h-screen relative">
            <div className="max-w-4xl mx-auto p-4">

                {/* Filter Tabs */}
                <div className="mb-8">
                    <div className="flex flex-col space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryChange(cat.id)}
                                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${category === cat.id
                                            ? "bg-indigo-600 text-white shadow-md"
                                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* My Posts filter */}
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowOnlyMyPosts(!showOnlyMyPosts)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${showOnlyMyPosts
                                        ? "bg-indigo-600 text-white shadow-md"
                                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                                    }`}
                            >
                                <UserCheck className="h-4 w-4" />
                                {showOnlyMyPosts ? "Showing My Posts" : "Show My Posts"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Posts Feed */}
                <div className="space-y-8">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <Card key={post._id} className="overflow-hidden shadow-md border-0 rounded-xl bg-white">
                                {/* Post Header */}
                                <div className="flex items-start p-6">
                                    <img
                                        src={post.authorDetails.avatar}
                                        alt={post.authorDetails.fullname}
                                        className="h-12 w-12 rounded-full mr-4 border-2 border-white shadow-sm"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg">{post.authorDetails.fullname}</h3>
                                        <TimeAgo className="text-gray-600 text-xs" date={post.createdAt} />
                                    </div>
                                    <div className="ml-auto flex items-center gap-2">
                                        {post.category && (
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
                                                {post.category}
                                            </span>
                                        )}
                                        {post.isAuthor && (
                                            <button
                                                onClick={() => {
                                                    setPostToDelete(post._id);
                                                    setShowDeleteDialog(true);
                                                }}
                                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                title="Delete post"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Post Content */}
                                <div className="px-6 pb-4">
                                    <p className="text-gray-800 text-base leading-relaxed"><Linkify options={hyperLinkOptions}>{post.content}</Linkify></p>
                                </div>

                                {/* Post Media */}
                                {post.media && (
                                    <div className="w-full">
                                        <img
                                            src={post.media}
                                            alt="Post content"
                                            className="w-full max-h-[500px] object-cover"
                                        />
                                    </div>
                                )}




                                {/* Post Actions with Comment Button */}
                                <div className="flex border-t border-gray-100">
                                    <button
                                        onClick={() => likePost(post._id)}
                                        className={`flex-1 flex justify-center items-center py-3 transition-colors ${post.isLikedByUser
                                            ? 'text-indigo-600 bg-indigo-50'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
                                            }`}
                                        disabled={likeInProgress}
                                    >
                                        <Heart className={`h-5 w-5 mr-2 ${post.isLikedByUser ? 'fill-indigo-600' : ''}`} />
                                        <span className="font-medium">Like ({post.likesCount})</span>
                                    </button>
                                    <div className="w-px bg-gray-100"></div>
                                    <button
                                        onClick={() => {
                                            setActiveCommentPostId(post._id);
                                            setShowCommentDialog(true);
                                        }}
                                        className="flex-1 flex justify-center items-center py-3 text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                                    >
                                        <MessageCircle className="h-5 w-5 mr-2" />
                                        <span className="font-medium">Comment ({post.commentsCount})</span>
                                    </button>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card className="p-8 text-center shadow-md border-0 rounded-xl bg-white">
                            <h3 className="text-xl font-medium text-gray-700 mb-2">No posts found</h3>
                            <p className="text-gray-500">There are no {category !== "" ? category.toLowerCase() : ""} posts available right now.</p>
                        </Card>
                    )}
                </div>
            </div>

            {/* Floating Add Post Button */}
            <Button
                onClick={() => setShowNewPostDialog(true)}
                className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg"
            >
                <PenSquare className="h-6 w-6 text-white" />
            </Button>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Post</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-gray-700">Are you sure you want to delete this post? This action cannot be undone.</p>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deletePost(postToDelete)}
                            disabled={submitting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {submitting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* New Post Dialog */}
            <Dialog open={showNewPostDialog} onOpenChange={(state) => { setShowNewPostDialog(state); setNewPostForm({ ...newPostForm, media: null }) }}>
                <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create New Post</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitNewPost}>
                        <div className="space-y-4 py-4">
                            <textarea
                                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                                placeholder="Write the content of your post here..."
                                value={newPostForm.content}
                                onChange={(e) => setNewPostForm({ ...newPostForm, content: e.target.value })}
                                required
                            />

                            {/* Show media preview if a file is selected */}
                            {newPostForm.media && (
                                <div className="relative border border-gray-200 rounded-md p-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-gray-800/60 hover:bg-gray-800"
                                        onClick={() => setNewPostForm({ ...newPostForm, media: null })}
                                    >
                                        <X className="h-4 w-4 text-white" />
                                    </Button>
                                    <img
                                        src={URL.createObjectURL(newPostForm.media)}
                                        alt="Preview"
                                        className="max-h-60 rounded mx-auto"
                                    />

                                </div>
                            )}

                            <div className="flex gap-2">
                                <Select
                                    value={newPostForm.category}
                                    onValueChange={(value) => setNewPostForm({ ...newPostForm, category: value })}
                                    className="flex-1"
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Categories</SelectLabel>
                                            <SelectItem value="success">Success Stories</SelectItem>
                                            <SelectItem value="event">Events</SelectItem>
                                            <SelectItem value="career">Career</SelectItem>
                                            <SelectItem value="project showcase">Project Showcase</SelectItem>
                                            <SelectItem value="college news">College News</SelectItem>
                                        </SelectGroup>
                                        <SelectSeparator />
                                        <SelectGroup>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>




                                {/* Hidden file input */}
                                <input
                                    type="file"
                                    id="media-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setNewPostForm({ ...newPostForm, media: e.target.files[0] });
                                        }
                                    }}
                                />

                                {/* Button that triggers the hidden file input */}
                                <Button
                                    type="button"
                                    className="flex items-center gap-1"
                                    variant="outline"
                                    onClick={() => document.getElementById('media-upload').click()}
                                >
                                    <Image className="h-4 w-4" />
                                    Add Media
                                </Button>
                            </div>

                            <div className="flex justify-end mt-4">
                                <Button
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Posting...' : 'Post'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Comment Dialog Component */}
            <CommentDialog
                isOpen={showCommentDialog}
                onClose={() => setShowCommentDialog(false)}
                postId={activeCommentPostId}
            />
        </div>
    );
}


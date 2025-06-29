import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { MessageCircle, Heart, Image, Video, Send, ThumbsUp, X, PenSquare } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "./ui/dialog";
import axios from "axios";
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

export default function PostsPage() {
    const [category, setCategory] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [showNewPostDialog, setShowNewPostDialog] = useState(false);
    const [posts, setPosts] = useState([]);
    const [newPostForm, setNewPostForm] = useState({
        content: "",
        category: "",
        media: null // This will hold the file object for media uploads
    });
    const [submitting, setSubmitting] = useState(false);

    
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
            const response = await axios.post("http://localhost:8000/gradlink/api/v1/users/create-post", formData, { withCredentials: true })
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
    const getPosts = async () => {
        try {
            const response = await axios.post("http://localhost:8000/gradlink/api/v1/users/get-posts", { category }, { withCredentials: true });
            console.log(response.data.data.docs);
            setTotalPages(response.data?.data.totalPages)
            setPosts(response.data.data.docs);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setLoading(false);
        }
    }


    useEffect(() => {
        getPosts();
    }, [category])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-indigo-500"></div>
            </div>
        );
    }


    return (
        <div className="bg-gray-50 min-h-screen relative">
            <div className="max-w-4xl mx-auto p-4">


                {/* Filter Tabs */}
                <div className="mb-8">
                    <Tabs value={category} onValueChange={setCategory} className="w-full">
                        <TabsList className="w-full flex justify-between bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
                            <TabsTrigger
                                value=""
                                className="flex-1 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
                            >
                                All Posts
                            </TabsTrigger>
                            <TabsTrigger
                                value="success"
                                className="flex-1 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
                            >
                                Success Stories
                            </TabsTrigger>
                            <TabsTrigger
                                value="event"
                                className="flex-1 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
                            >
                                Events
                            </TabsTrigger>
                            <TabsTrigger
                                value="career"
                                className="flex-1 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
                            >
                                Career
                            </TabsTrigger>
                            <TabsTrigger
                                value="project showcase"
                                className="flex-1 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
                            >
                                Project Showcase
                            </TabsTrigger>
                            <TabsTrigger
                                value="college news"
                                className="flex-1 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
                            >
                                College News
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
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
                                        <p className="text-xs text-gray-500 mt-1">{post.createdAt}</p>
                                    </div>
                                    {post.category && (
                                        <span className="ml-auto px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
                                            {post.category}
                                        </span>
                                    )}
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
                                    <button className="flex-1 flex justify-center items-center py-3 text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                                        <Heart className="h-5 w-5 mr-2" />
                                        <span className="font-medium">Like ({post.likesCount})</span>
                                    </button>
                                    <div className="w-px bg-gray-100"></div>
                                    <button
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

            {/* New Post Dialog */}
            <Dialog open={showNewPostDialog} onOpenChange={(state) => { setShowNewPostDialog(state); setNewPostForm({ ...newPostForm, media: null }) }}>
                <DialogContent className="sm:max-w-[525px]">
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
        </div>
    );
}

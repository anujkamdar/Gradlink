import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { MessageCircle, Heart, Image, Video, Send, ThumbsUp, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "./ui/dialog";
import axios from "axios";

export default function PostsPage() {
    const [activeFilter, setActiveFilter] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: {
                id: 101,
                name: "Alex Johnson",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                position: "Software Engineer at TechCorp",
                isAlumni: true
            },
            content: "Just completed a major project using React and Node.js. It's amazing what you can build with modern web technologies!",
            media: {
                type: "image",
                url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80"
            },
            timestamp: "2 hours ago",
            likes: 42,
            comments: 8,
            commentsList: [
                {
                    id: 101,
                    author: {
                        id: 102,
                        name: "Sophia Martinez",
                        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                    },
                    content: "This is incredible! What libraries did you use for the front-end?",
                    timestamp: "1 hour ago"
                },
                {
                    id: 102,
                    author: {
                        id: 107,
                        name: "Robert Taylor",
                        avatar: "https://randomuser.me/api/portraits/men/42.jpg",
                    },
                    content: "Great work! Would love to see a demo sometime.",
                    timestamp: "45 minutes ago"
                }
            ],
            category: "Success Story"
        },
        {
            id: 2,
            author: {
                id: 102,
                name: "Sophia Martinez",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                position: "UX Designer at DesignHub",
                isAlumni: true
            },
            content: "Excited to announce that I'll be speaking at the upcoming UX Conference next month. If any fellow alumni are attending, let's connect!",
            media: null,
            timestamp: "5 hours ago",
            likes: 78,
            comments: 15,
            commentsList: [
                {
                    id: 201,
                    author: {
                        id: 101,
                        name: "Alex Johnson",
                        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                    },
                    content: "Congratulations! What topics will you be covering?",
                    timestamp: "4 hours ago"
                },
                {
                    id: 202,
                    author: {
                        id: 104,
                        name: "Emily Wilson",
                        avatar: "https://randomuser.me/api/portraits/women/22.jpg",
                    },
                    content: "I'll be there! Would love to meet up.",
                    timestamp: "3 hours ago"
                }
            ],
            category: "Event"
        },
        {
            id: 3,
            author: {
                id: 103,
                name: "David Kim",
                avatar: "https://randomuser.me/api/portraits/men/75.jpg",
                position: "Data Scientist at AnalyticsPro",
                isAlumni: false
            },
            content: "Just published my research paper on machine learning applications in healthcare. Proud of this achievement and grateful for the support from our university community.",
            media: {
                type: "video",
                url: "https://player.vimeo.com/external/394678700.sd.mp4?s=353646e34d7bde02ad0d4b8a2267bde175db1773&profile_id=165&oauth2_token_id=57447761",
                thumbnail: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            },
            timestamp: "1 day ago",
            likes: 124,
            comments: 32,
            commentsList: [
                {
                    id: 301,
                    author: {
                        id: 105,
                        name: "Michael Chen",
                        avatar: "https://randomuser.me/api/portraits/men/54.jpg",
                    },
                    content: "This is groundbreaking work! Would love to discuss further.",
                    timestamp: "23 hours ago"
                },
                {
                    id: 302,
                    author: {
                        id: 106,
                        name: "Jennifer Adams",
                        avatar: "https://randomuser.me/api/portraits/women/65.jpg",
                    },
                    content: "Congratulations on the publication! Proud of your achievements.",
                    timestamp: "20 hours ago"
                },
                {
                    id: 303,
                    author: {
                        id: 102,
                        name: "Sophia Martinez",
                        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                    },
                    content: "Can you share a link to the paper? I'd love to read it.",
                    timestamp: "12 hours ago"
                }
            ],
            category: "Success Story"
        },
        {
            id: 4,
            author: {
                id: 104,
                name: "Emily Wilson",
                avatar: "https://randomuser.me/api/portraits/women/22.jpg",
                position: "Marketing Manager at BrandBoost",
                isAlumni: true
            },
            content: "Looking for recommendations for project management tools that work well for remote marketing teams. What's everyone using these days?",
            media: null,
            timestamp: "2 days ago",
            likes: 36,
            comments: 45,
            commentsList: [
                {
                    id: 401,
                    author: {
                        id: 101,
                        name: "Alex Johnson",
                        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                    },
                    content: "We've been using Asana and it's been working great for our remote team.",
                    timestamp: "1 day ago"
                },
                {
                    id: 402,
                    author: {
                        id: 105,
                        name: "Michael Chen",
                        avatar: "https://randomuser.me/api/portraits/men/54.jpg",
                    },
                    content: "Trello has been our go-to. Simple and effective.",
                    timestamp: "1 day ago"
                },
                {
                    id: 403,
                    author: {
                        id: 106,
                        name: "Jennifer Adams",
                        avatar: "https://randomuser.me/api/portraits/women/65.jpg",
                    },
                    content: "We use a combination of Slack and Monday.com. Works really well for cross-team collaboration.",
                    timestamp: "20 hours ago"
                }
            ],
            category: "Workshop"
        },
        {
            id: 5,
            author: {
                id: 105,
                name: "Michael Chen",
                avatar: "https://randomuser.me/api/portraits/men/54.jpg",
                position: "Product Manager at InnovateCo",
                isAlumni: true
            },
            content: "Proud to share that our team just launched a new product feature that has increased user engagement by 47%! Hard work pays off.",
            media: {
                type: "image",
                url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            },
            timestamp: "3 days ago",
            likes: 89,
            comments: 12,
            commentsList: [
                {
                    id: 501,
                    author: {
                        id: 101,
                        name: "Alex Johnson",
                        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                    },
                    content: "That's an impressive increase! What kind of feature was it?",
                    timestamp: "2 days ago"
                },
                {
                    id: 502,
                    author: {
                        id: 104,
                        name: "Emily Wilson",
                        avatar: "https://randomuser.me/api/portraits/women/22.jpg",
                    },
                    content: "Amazing results! Would love to hear more about the strategy behind it.",
                    timestamp: "2 days ago"
                }
            ],
            category: "Success Story"
        },
        {
            id: 6,
            author: {
                id: 106,
                name: "Jennifer Adams",
                avatar: "https://randomuser.me/api/portraits/women/65.jpg",
                position: "Class of 2020, Computer Science",
                isAlumni: true
            },
            content: "So excited for our 5-year class reunion next month! Can't wait to see everyone and catch up on all the amazing things you've been doing since graduation!",
            media: {
                type: "image",
                url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            },
            timestamp: "4 days ago",
            likes: 156,
            comments: 42,
            commentsList: [
                {
                    id: 601,
                    author: {
                        id: 102,
                        name: "Sophia Martinez",
                        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                    },
                    content: "Can't wait to see everyone! It's been too long.",
                    timestamp: "3 days ago"
                },
                {
                    id: 602,
                    author: {
                        id: 101,
                        name: "Alex Johnson",
                        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                    },
                    content: "Looking forward to it! Where's the venue again?",
                    timestamp: "3 days ago"
                },
                {
                    id: 603,
                    author: {
                        id: 103,
                        name: "David Kim",
                        avatar: "https://randomuser.me/api/portraits/men/75.jpg",
                    },
                    content: "I'll be flying in from San Francisco. Anyone else coming from the West Coast?",
                    timestamp: "2 days ago"
                }
            ],
            category: "Reunion"
        },
        {
            id: 7,
            author: {
                id: 107,
                name: "Robert Taylor",
                avatar: "https://randomuser.me/api/portraits/men/42.jpg",
                position: "Career Coach, Alumni Services",
                isAlumni: true
            },
            content: "I'm hosting a resume writing and interview skills workshop next Tuesday at 6 PM. This is specifically designed for recent graduates looking to stand out in the job market. Register through the alumni portal!",
            media: null,
            timestamp: "5 days ago",
            likes: 65,
            comments: 18,
            commentsList: [
                {
                    id: 701,
                    author: {
                        id: 104,
                        name: "Emily Wilson",
                        avatar: "https://randomuser.me/api/portraits/women/22.jpg",
                    },
                    content: "Will this be recorded for those who can't attend live?",
                    timestamp: "4 days ago"
                },
                {
                    id: 702,
                    author: {
                        id: 106,
                        name: "Jennifer Adams",
                        avatar: "https://randomuser.me/api/portraits/women/65.jpg",
                    },
                    content: "Just registered! Looking forward to it.",
                    timestamp: "3 days ago"
                }
            ],
            category: "Workshop"
        }
    ]);
    const getPosts = async () => {
        try {
            const response = await axios.post("http://localhost:8000/gradlink/api/v1/users/get-posts", { currentPage }, { withCredentials: true });
            console.log(response.data.data)
            setTotalPages(response.data?.data.totalPages)
            setLoading(false);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setLoading(false);
        }
    }


    useEffect(() => {
        getPosts();
    }, [])


    return (
        <div className="bg-gray-50 min-h-screen">

            <div className="max-w-4xl mx-auto p-4">


                {/* Filter Tabs */}
                <div className="mb-8">
                    <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full">
                        <TabsList className="w-full flex justify-between bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
                            <TabsTrigger
                                value=""
                                className="flex-1 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
                            >
                                All Posts
                            </TabsTrigger>
                            <TabsTrigger
                                value="Success Story"
                                className="flex-1 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
                            >
                                Success Stories
                            </TabsTrigger>
                            <TabsTrigger
                                value="Event"
                                className="flex-1 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
                            >
                                Events
                            </TabsTrigger>
                            <TabsTrigger
                                value="Reunion"
                                className="flex-1 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
                            >
                                Reunions
                            </TabsTrigger>
                            <TabsTrigger
                                value="Workshop"
                                className="flex-1 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
                            >
                                Workshops
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Posts Feed */}
                <div className="space-y-8">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <Card key={post.id} className="overflow-hidden shadow-md border-0 rounded-xl bg-white">
                                {/* Post Header */}
                                <div className="flex items-start p-6">
                                    <img
                                        src={post.author.avatar}
                                        alt={post.author.name}
                                        className="h-12 w-12 rounded-full mr-4 border-2 border-white shadow-sm"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg">{post.author.name}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{post.timestamp}</p>
                                    </div>
                                    {post.category && (
                                        <span className="ml-auto px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
                                            {post.category}
                                        </span>
                                    )}
                                </div>

                                {/* Post Content */}
                                <div className="px-6 pb-4">
                                    <p className="text-gray-800 text-base leading-relaxed">{post.content}</p>
                                </div>

                                {/* Post Media */}
                                {post.media && (
                                    <div className="w-full">
                                        <img
                                            src={post.media.url}
                                            alt="Post content"
                                            className="w-full max-h-[500px] object-cover"
                                        />
                                    </div>
                                )}




                                {/* Post Actions with Comment Button */}
                                <div className="flex border-t border-gray-100">
                                    <button className="flex-1 flex justify-center items-center py-3 text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                                        <Heart className="h-5 w-5 mr-2" />
                                        <span className="font-medium">Like ({post.likes})</span>
                                    </button>
                                    <div className="w-px bg-gray-100"></div>
                                    <button
                                        className="flex-1 flex justify-center items-center py-3 text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                                    >
                                        <MessageCircle className="h-5 w-5 mr-2" />
                                        <span className="font-medium">Comment ({post.comments})</span>
                                    </button>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card className="p-8 text-center shadow-md border-0 rounded-xl bg-white">
                            <h3 className="text-xl font-medium text-gray-700 mb-2">No posts found</h3>
                            <p className="text-gray-500">There are no {activeFilter !== "all" ? activeFilter.toLowerCase() : ""} posts available right now.</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Users, Briefcase, Calendar, ChevronRight } from "lucide-react";


export default function Homepage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("home");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [recentJobs, setRecentJobs] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        setRecentJobs([
            {
                id: 1,
                title: "Senior Software Engineer",
                company: "TechCorp",
                location: "Remote",
                type: "Full-time",
                postedBy: "Amit Sharma (Batch of 2015)",
                postedDate: "2 days ago"
            },
            {
                id: 2,
                title: "Product Manager",
                company: "InnovateX",
                location: "Bangalore",
                type: "Full-time",
                postedBy: "Priya Patel (Batch of 2017)",
                postedDate: "1 week ago"
            },
            {
                id: 3,
                title: "UX Designer Internship",
                company: "DesignHub",
                location: "Delhi",
                type: "Internship",
                postedBy: "Ravi Kumar (Batch of 2016)",
                postedDate: "3 days ago"
            }
        ]);

        setUpcomingEvents([
            {
                id: 1,
                title: "Annual Alumni Meet",
                date: "July 15, 2025",
                location: "Campus Auditorium",
                attendees: 85
            },
            {
                id: 2,
                title: "Tech Webinar: AI Advancements",
                date: "June 20, 2025",
                location: "Virtual",
                attendees: 120
            },
            {
                id: 3,
                title: "Career Guidance Workshop",
                date: "June 10, 2025",
                location: "Campus Seminar Hall",
                attendees: 50
            }
        ]);

        setNotifications([
            {
                id: 1,
                type: "connection",
                message: "Priya Patel accepted your connection request",
                time: "2 hours ago"
            },
            {
                id: 2,
                type: "job",
                message: "New job posting matches your profile: Data Scientist at DataTech",
                time: "1 day ago"
            },
            {
                id: 3,
                type: "event",
                message: "Reminder: Annual Alumni Meet registration closes tomorrow",
                time: "3 days ago"
            }
        ]);
    }, [navigate])
    return (
        <div className="bg-gray-50 min-h-screen">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Welcome Section */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Welcome back, {user?.fullname?.split(" ")[0] || "User"}!
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {user?.role === "alumni" ? "Alumni" : "Student"} • {user?.major} • Batch of {user?.graduationYear}
                                    </p>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    <Button
                                        onClick={() => navigate("/profile-page")}
                                        className="inline-flex items-center"
                                    >
                                        View Profile
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-none">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 rounded-full bg-purple-100">
                                        <Users className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-gray-500">Network</h3>
                                        <p className="text-2xl font-bold text-gray-900">250+</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Button variant="outline" className="w-full text-purple-600 border-purple-200 hover:bg-purple-50">
                                        Grow Your Network
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-none">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 rounded-full bg-blue-100">
                                        <Briefcase className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-gray-500">Job Opportunities</h3>
                                        <p className="text-2xl font-bold text-gray-900">45</p>
                                    </div>
                                </div>                  <div className="mt-4">
                                    <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => navigate("/jobs")}>
                                        Browse Jobs
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-none">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 rounded-full bg-green-100">
                                        <Calendar className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-gray-500">Upcoming Events</h3>
                                        <p className="text-2xl font-bold text-gray-900">8</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Button variant="outline" className="w-full text-green-600 border-green-200 hover:bg-green-50">
                                        View Calendar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Jobs */}
                    <Card>
                        <CardHeader className="px-6 pt-6 pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-bold">Recent Job Opportunities</CardTitle>
                                <Button
                                    variant="ghost"
                                    onClick={() => setActiveTab("jobs")}
                                    className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                                >
                                    View All
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <div className="space-y-4">
                                {recentJobs.map((job) => (
                                    <div key={job.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{job.title}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {job.company} • {job.location}
                                                </p>
                                                <div className="mt-1 flex items-center">
                                                    <Badge variant="outline" className="mr-2 bg-blue-50 text-blue-700 border-blue-200">
                                                        {job.type}
                                                    </Badge>
                                                    <span className="text-xs text-gray-500">Posted {job.postedDate}</span>
                                                </div>
                                            </div>
                                            <Button className="mt-3 md:mt-0" size="sm">
                                                Apply Now
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Events */}
                    <Card>
                        <CardHeader className="px-6 pt-6 pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-bold">Upcoming Events</CardTitle>
                                <Button
                                    variant="ghost"
                                    onClick={() => setActiveTab("events")}
                                    className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                                >
                                    View All
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <div className="space-y-4">
                                {upcomingEvents.map((event) => (
                                    <div key={event.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                            <div>
                                                <h3 className="font-medium text-gray-900">{event.title}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {event.date} • {event.location}
                                                </p>
                                                <div className="mt-1 flex items-center">
                                                    <span className="text-xs text-gray-500">{event.attendees} people attending</span>
                                                </div>
                                            </div>
                                            <Button className="mt-3 md:mt-0" size="sm" variant="outline">
                                                RSVP
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

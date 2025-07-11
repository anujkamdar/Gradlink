import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { Backend_url } from "@/info";
import { Calendar, Briefcase, Users, BookOpen, Award, TrendingUp, Clock, Bell, ArrowRight, Check, AlertCircle, User, Gift, DollarSign, Search, School, GraduationCap, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import TimeAgo from "react-timeago";
export default function Homepage() {
    const [user, setUser] = useState(null);
    const [profileCompletion, setProfileCompletion] = useState(0);
    const [incompleteFields, setIncompleteFields] = useState([]);
    const [completedFields, setCompletedFields] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [posts, setPosts] = useState([]);
    const [donations, setDonations] = useState([]);
    const [fundraisers, setFundraisers] = useState([]);
    const [networkStats, setNetworkStats] = useState({
        totalUsers: 0,
        totalAlumni: 0,
        totalStudents: 0,
        totalJobs: 0,
        totalPosts: 0,
        totalDonations: 0
    });
    const [loading, setLoading] = useState(true);

    const calculateProfileCompletion = (userData) => {
        if (!userData) return;

        const requiredFields = [
            { name: 'fullname', label: 'Full Name' },
            { name: 'email', label: 'Email' },
            { name: 'graduationYear', label: 'Graduation Year' },
            { name: 'major', label: 'Major' },
            { name: 'skills', label: 'Skills' },
            { name: 'avatar', label: 'Profile Picture' },
            { name: 'bio', label: 'Bio' },
            { name: 'company', label: 'Company' },
            { name: 'position', label: 'Position' },
            { name: 'location', label: 'Location' }
        ];

        let completedFields = 0;
        const incomplete = [];
        const completed = [];

        requiredFields.forEach(field => {
            const value = userData[field.name];

            if (field.name === 'skills') {
                if (Array.isArray(value) && value.length > 0) {
                    completedFields++;
                    completed.push(field);
                } else {
                    incomplete.push(field);
                }
            } else if (typeof value === 'string') {
                if (value.trim() !== '') {
                    completedFields++;
                    completed.push(field);
                } else {
                    incomplete.push(field);
                }
            } else if (value !== undefined && value !== null) {
                completedFields++;
                completed.push(field);
            } else {
                incomplete.push(field);
            }
        });


        setIncompleteFields(incomplete.map(field => field.label));
        setCompletedFields(completed.map(field => field.label));
        const percentage = Math.floor((completedFields / requiredFields.length) * 100);
        setProfileCompletion(percentage);

        return {
            completed,
            incomplete,
            percentage
        };
    };



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${Backend_url}/gradlink/api/v1/users/get-homepage-data`, { withCredentials: true });
                setLoading(false);
                console.log(response.data.data);
                if (response.data.success) {
                    const { user, jobs, posts, donations, networkStats } = response.data.data;
                    setUser(user);
                    setJobs(jobs);
                    setPosts(posts);
                    setDonations(donations);
                    calculateProfileCompletion(user);
                    setNetworkStats(networkStats);
                }
            } catch (error) {
                console.error("Error fetching homepage data:", error);
            }
        }
        fetchData();
    }, [])



    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }


    return (
        <div className="bg-gray-50 min-h-screen pb-10">
            {/* Welcome Banner with Network Stats */}
            <div className="bg-gradient-to-r from-indigo-800 to-indigo-500 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-md">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div className="md:w-2/3">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
                                    <img
                                        src={user.avatar}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold">
                                        Hello, {user?.fullname?.split(' ')[0] || 'there'}!
                                    </h1>
                                    <p className="text-white/70 text-sm md:text-base">
                                        {user?.role === 'alumni' ? `Class of ${user?.graduationYear || 'N/A'}` : 'Student'} • {user?.major || 'No major'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 md:text-right self-start md:w-1/3">
                            {profileCompletion < 100 && (
                                <div className="w-full mb-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-white/70">Profile Completion</span>
                                        <span className="text-xs font-medium">{profileCompletion}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white"
                                            style={{ width: `${profileCompletion}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            <Link to="/my-profile-page" className="w-full sm:w-auto">
                                <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 w-full">
                                    <User size={16} className="mr-1.5" /> My Profile
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Dashboard Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                {/* Detailed Profile Completion Section */}
                {profileCompletion < 100 && (
                    <div className="bg-white border border-indigo-200 rounded-lg p-6 mb-8 shadow-md">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Left Column - Profile Status */}
                            <div className="md:col-span-1">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="p-2.5 bg-indigo-100 rounded-full text-indigo-600">
                                        <AlertCircle size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800">Profile Completion</h3>
                                        <p className="text-sm text-gray-600">
                                            Complete your profile to unlock more opportunities
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-indigo-700">Completion Status</span>
                                        <span className="text-lg font-bold text-indigo-700">{profileCompletion}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-white rounded-full overflow-hidden mb-3">
                                        <div
                                            className={`h-full ${profileCompletion < 30 ? 'bg-red-500' : profileCompletion < 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                            style={{ width: `${profileCompletion}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        {profileCompletion < 30 ? (
                                            'Your profile needs significant attention'
                                        ) : profileCompletion < 70 ? (
                                            'You\'re making good progress!'
                                        ) : (
                                            'Almost there! Just a few more details to complete'
                                        )}
                                    </p>
                                </div>

                                <Link to="/my-profile-page" className="w-full">
                                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2">
                                        Update Your Profile
                                    </Button>
                                </Link>
                            </div>

                            {/* Right Column - Fields Status */}
                            <div className="md:col-span-2">
                                <h4 className="font-semibold text-gray-700 mb-3">Profile Fields Status</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {/* Completed Fields */}
                                    <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                                <Check size={12} className="text-green-600" />
                                            </div>
                                            <h5 className="font-medium text-green-700">Completed</h5>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {completedFields.map((field, index) => (
                                                <Badge key={index} className="bg-green-100 text-green-700 border-green-200 py-1">
                                                    <Check size={12} className="mr-1" /> {field}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Missing Fields */}
                                    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                                                <AlertCircle size={14} className="text-red-600" />
                                            </div>
                                            <h5 className="font-medium text-red-700">Missing</h5>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {incompleteFields.map((field, index) => (
                                                <Badge key={index} className="bg-red-100 text-red-700 border-red-200 py-1">
                                                    <AlertCircle size={12} className="mr-1" /> {field}
                                                </Badge>
                                            ))}
                                        </div>
                                        {incompleteFields.length === 0 && (
                                            <p className="text-sm text-gray-500">No missing fields! Your profile is complete.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <h5 className="font-medium text-yellow-700 mb-2 flex items-center gap-2">
                                        <AlertCircle size={16} /> Why is this important?
                                    </h5>
                                    <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
                                        <li>A complete profile helps you stand out to potential employers</li>
                                        <li>Job opportunities match better with fully completed profiles</li>
                                        <li>You'll appear more frequently in search results</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Three Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Left Column - Posts */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                            <div className="p-4 bg-gradient-to-r from-indigo-700 to-indigo-500 text-white flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <BookOpen size={16} className="text-white" />
                                    <h2 className="font-semibold">Recent Posts</h2>
                                </div>
                                <Link to="/tabs/posts">
                                    <Button size="sm" variant="ghost" className="bg-white/10 hover:bg-white/20 text-white text-xs h-8">
                                        View All
                                    </Button>
                                </Link>
                            </div>

                            {posts.length > 0 ? (
                                <div className="divide-y">
                                    {posts.map((post, index) => (
                                        <div key={index} className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={post.author?.avatar || "https://via.placeholder.com/40"}
                                                        alt="Avatar"
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-semibold text-sm">{post.author.fullname || "Anonymous User"}</h3>
                                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                                            <TimeAgo date={post.createdAt} />
                                                        </span>
                                                    </div>
                                                    <p className="mt-2 text-sm line-clamp-2">{post.content}</p>

                                                    {post.media && (
                                                        <div className="mt-3 h-40 rounded-md overflow-hidden">
                                                            <img
                                                                src={post.media}
                                                                alt="Post image"
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-gray-500">
                                    <BookOpen size={32} className="mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">No posts found</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Middle Column - Jobs */}
                    <div className="space-y-4">
                        {/* Job Opportunities */}
                        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                            <div className="p-4 bg-gradient-to-r from-indigo-700 to-indigo-500 text-white flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Briefcase size={16} className="text-white" />
                                    <h2 className="font-semibold">Job Opportunities</h2>
                                </div>
                                <Link to="/tabs/jobs">
                                    <Button size="sm" variant="ghost" className="bg-white/10 hover:bg-white/20 text-white text-xs h-8">
                                        View All
                                    </Button>
                                </Link>
                            </div>

                            {jobs.length > 0 ? (
                                <div className="divide-y">
                                    {jobs.map((job, index) => (
                                        <div key={index} className="p-4">
                                            <div>
                                                <div className="flex justify-between">
                                                    <h3 className="font-semibold text-base">{job.title}</h3>
                                                    <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200">
                                                        {job.type}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-0.5">{job.company} • {job.location}</p>
                                                <p className="text-sm mt-2 line-clamp-3">{job.description}</p>

                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {job.requiredSkills && job.requiredSkills.slice(0, 3).map((skill, i) => (
                                                        <Badge key={i} variant="outline" className="text-xs bg-gray-50">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                    {job.requiredSkills && job.requiredSkills.length > 3 && (
                                                        <Badge variant="outline" className="text-xs bg-gray-50">
                                                            +{job.requiredSkills.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between mt-3 pt-2 border-t">
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <Clock size={14} className="mr-1" />
                                                        <span className="mr-1">Posted</span>
                                                        <TimeAgo date={job.createdAt} />
                                                    </div>
                                                    <Link to={`/tabs/jobs/${job._id}`}>
                                                        <Button size="sm" variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 h-8">
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-gray-500">
                                    <Briefcase size={32} className="mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">No job opportunities found</p>
                                </div>
                            )}
                        </div>


                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        {/* Network Stats Card */}
                        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                            <div className="p-4 bg-gradient-to-r from-indigo-700 to-indigo-500 text-white flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Users size={16} className="text-white" />
                                    <h2 className="font-semibold">Network Stats</h2>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 border rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Users size={18} className="text-indigo-500" />
                                            <span className="text-sm font-medium">Total Users</span>
                                        </div>
                                        <p className="text-2xl font-bold text-indigo-700">{networkStats.totalUsers}</p>
                                    </div>
                                    <div className="p-3 border rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <GraduationCap size={18} className="text-indigo-500" />
                                            <span className="text-sm font-medium">Alumni</span>
                                        </div>
                                        <p className="text-2xl font-bold text-indigo-700">{networkStats.totalAlumni}</p>
                                    </div>
                                    <div className="p-3 border rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <School size={18} className="text-indigo-500" />
                                            <span className="text-sm font-medium">Students</span>
                                        </div>
                                        <p className="text-2xl font-bold text-indigo-700">{networkStats.totalStudents}</p>
                                    </div>
                                    <div className="p-3 border rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Briefcase size={18} className="text-indigo-500" />
                                            <span className="text-sm font-medium">Jobs</span>
                                        </div>
                                        <p className="text-2xl font-bold text-indigo-700">{networkStats.totalJobs}</p>
                                    </div>
                                    <div className="p-3 border rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <BookOpen size={18} className="text-indigo-500" />
                                            <span className="text-sm font-medium">Posts</span>
                                        </div>
                                        <p className="text-2xl font-bold text-indigo-700">{networkStats.totalPosts}</p>
                                    </div>
                                    <div className="p-3 border rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Gift size={18} className="text-indigo-500" />
                                            <span className="text-sm font-medium">Donations</span>
                                        </div>
                                        <p className="text-2xl font-bold text-indigo-700">{networkStats.totalDonations}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Donations */}
                        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                            <div className="p-4 bg-gradient-to-r from-indigo-700 to-indigo-500 text-white flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Gift size={16} className="text-white" />
                                    <h2 className="font-semibold">Recent Donations</h2>
                                </div>
                            </div>
                            <div className="divide-y">
                                {donations.slice(0, 3).map((donation, index) => (
                                    <div key={index} className="p-4">
                                        <div className="flex items-start gap-4">
                                            <div className="h-14 w-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-indigo-100">
                                                <img
                                                    src={donation.donor.avatar}
                                                    alt="Donor"
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-medium">{donation.donor.fullname}</h3>
                                                    <span className="text-xs text-gray-500">
                                                        <TimeAgo date={donation.createdAt} />
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1 my-1">
                                                    <Badge className="bg-green-100 text-green-800 border-green-200">
                                                        <DollarSign size={12} className="mr-1" /> ₹{donation.amount.toLocaleString()}
                                                    </Badge>
                                                    <span className="text-xs text-gray-500">donated to</span>
                                                </div>

                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="h-8 w-8 rounded-md overflow-hidden bg-indigo-50 flex-shrink-0">
                                                        <img
                                                            src={donation.fundraiser?.coverImage}
                                                            alt="Fundraiser"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-">{donation.fundraiser?.title}</p>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

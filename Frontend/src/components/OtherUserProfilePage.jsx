import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
    Users,
    Briefcase,
    GraduationCap,
    Mail,
    MapPin,
    Building,
    BookOpen,
    Calendar,
    Award,
    XCircle,
    Heart,
    Trophy,
    Star
} from "lucide-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Backend_url } from "../info.js";

function OtherUserProfilePage() {
    const navigate = useNavigate();
    const { otherUserId } = useParams();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({});
    const [error, setError] = useState(null);

    const getAchievementBadges = (badges) => [
        {
            id: 1,
            title: "First Donation",
            description: "Made your first contribution",
            icon: Heart,
            color: "from-pink-500 to-rose-500",
            earned: badges?.firstDonation || false,
            category: "donation"
        },
        {
            id: 2,
            title: "Generous Donor",
            description: "Donated to 5+ fundraisers",
            icon: Heart,
            color: "from-rose-500 to-red-500",
            earned: badges?.generousDonor || false,
            category: "donation"
        },
        {
            id: 3,
            title: "Top Supporter",
            description: "Donated ₹10000+ total",
            icon: Trophy,
            color: "from-amber-500 to-yellow-500",
            earned: badges?.topSupporter || false,
            category: "donation"
        },
        {
            id: 4,
            title: "Job Pioneer",
            description: "Posted your first job",
            icon: Briefcase,
            color: "from-blue-500 to-indigo-500",
            earned: badges?.jobPioneer || false,
            category: "job"
        },
        {
            id: 5,
            title: "Active Recruiter",
            description: "Posted 10+ job opportunities",
            icon: Star,
            color: "from-indigo-500 to-purple-500",
            earned: badges?.activeRecruiter || false,
            category: "job"
        },
        {
            id: 6,
            title: "Hiring Champion",
            description: "Posted 50+ jobs",
            icon: Trophy,
            color: "from-purple-500 to-pink-500",
            earned: badges?.hiringChampion || false,
            category: "job"
        },
    ];

    const achievementBadges = getAchievementBadges(userData.badges);

    const getProfile = async () => {
        try {
            const response = await axios.get(`${Backend_url}/gradlink/api/v1/users/get-profile-data/${otherUserId}`, { withCredentials: true });
            console.log(response.data.data);
            setUserData(response.data.data);
            setLoading(false);
        } catch (err) {
            console.log(err || "Something went wrong frontend");
            setError(err?.response?.data?.message || "Something went wrong");
            setLoading(false);
        }
    }

    useEffect(() => {
        getProfile();
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="p-6 rounded-lg shadow-sm bg-white">
                    <div className="flex flex-col items-center">
                        <XCircle className="h-12 w-12 text-red-500" />
                        <p className="mt-4 text-lg font-medium text-gray-700">{error}</p>
                        <Button
                            className="mt-4"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
                {/* Header Card Section */}
                <section className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl pt-8">
                    <Card className="border border-gray-200/50 shadow-xl bg-white hover:shadow-2xl transition-all duration-300 overflow-hidden rounded-2xl">
                        <CardContent className="p-6 md:p-8">
                            {/* Profile with Avatar */}
                            <div>
                                <div className="flex flex-col items-center md:items-start">
                                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start w-full">
                                        {/* Avatar Section */}
                                        <div className="relative flex-shrink-0">
                                            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
                                                <img
                                                    src={userData.avatar}
                                                    alt={userData.fullname}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>

                                        {/* Profile Info Section */}
                                        <div className="flex-1 text-center md:text-left">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                <div className="space-y-3">
                                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                                                        {userData.fullname}
                                                    </h1>

                                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                                        <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 px-3 py-1 text-sm font-medium shadow-md rounded-full">
                                                            {userData.role && userData.role[0].toUpperCase() + userData.role.slice(1)}
                                                        </Badge>
                                                        {userData.position && (
                                                            <Badge variant="outline" className="border-blue-300 text-blue-700 px-3 py-1 bg-blue-50/50 rounded-full">
                                                                <Briefcase className="h-3 w-3 mr-1" />
                                                                {userData.position}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-sm text-gray-600">
                                                        <span className="flex items-center gap-1.5 font-medium">
                                                            <GraduationCap className="h-4 w-4 text-slate-600" />
                                                            Class of {userData.graduationYear}
                                                        </span>
                                                        {userData.major && (
                                                            <span className="flex items-center gap-1.5">
                                                                <BookOpen className="h-4 w-4 text-slate-600" />
                                                                {userData.major}
                                                            </span>
                                                        )}
                                                        {userData.company && (
                                                            <span className="flex items-center gap-1.5">
                                                                <Building className="h-4 w-4 text-slate-600" />
                                                                {userData.company}
                                                            </span>
                                                        )}
                                                        {userData.location && (
                                                            <span className="flex items-center gap-1.5">
                                                                <MapPin className="h-4 w-4 text-slate-600" />
                                                                {userData.location}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Achievement Badges in Header */}
                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Trophy className="h-4 w-4 text-amber-500" />
                                                            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                                                Achievements ({achievementBadges.filter(b => b.earned).length}/{achievementBadges.length})
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {achievementBadges.filter(badge => badge.earned).map((badge) => {
                                                                const IconComponent = badge.icon;
                                                                return (
                                                                    <div
                                                                        key={badge.id}
                                                                        className="group relative"
                                                                        title={`${badge.title}: ${badge.description}`}
                                                                    >
                                                                        <div
                                                                            className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${badge.color} shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300 cursor-pointer`}
                                                                        >
                                                                            <IconComponent className="h-5 w-5 text-white" />
                                                                        </div>
                                                                        {/* Tooltip */}
                                                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-xl">
                                                                            <div className="font-semibold">{badge.title}</div>
                                                                            <div className="text-gray-300 mt-0.5">{badge.description}</div>
                                                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                                                                <div className="border-4 border-transparent border-t-gray-900"></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                            {achievementBadges.filter(badge => !badge.earned).map((badge) => {
                                                                const IconComponent = badge.icon;
                                                                return (
                                                                    <div
                                                                        key={badge.id}
                                                                        className="group relative"
                                                                        title={`${badge.title}: ${badge.description} (Not earned yet)`}
                                                                    >
                                                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-200 opacity-40 cursor-help">
                                                                            <IconComponent className="h-5 w-5 text-gray-400" />
                                                                        </div>
                                                                        {/* Tooltip for locked badges */}
                                                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-xl">
                                                                            <div className="font-semibold text-gray-300">🔒 {badge.title}</div>
                                                                            <div className="text-gray-400 mt-0.5">{badge.description}</div>
                                                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                                                                <div className="border-4 border-transparent border-t-gray-900"></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Main Content Grid */}
                <section className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

                        {/* Left Sidebar - Compact Info Cards */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* About Me Card */}
                            <Card className="border border-gray-200/50 shadow-lg bg-white hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-600 to-blue-600"></div>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-600 to-blue-600 flex items-center justify-center">
                                            <Users className="h-4 w-4 text-white" />
                                        </div>
                                        About Me
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-gray-700 leading-relaxed">
                                        {userData.bio ? (
                                            <p>{userData.bio}</p>
                                        ) : (
                                            <p className="text-gray-400 italic">No bio provided</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contact Information Card */}
                            <Card className="border border-gray-200/50 shadow-lg bg-white hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                            <Mail className="h-4 w-4 text-white" />
                                        </div>
                                        Contact
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50/50 border border-gray-200">
                                        <Mail className="h-5 w-5 text-slate-600 mt-0.5 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</div>
                                            <div className="text-sm text-gray-900 break-all">{userData.email}</div>
                                        </div>
                                    </div>
                                    {userData.location && (
                                        <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50/50 border border-gray-200">
                                            <MapPin className="h-5 w-5 text-slate-600 mt-0.5 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Location</div>
                                                <div className="text-sm text-gray-900">{userData.location}</div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Skills Card */}
                            <Card className="border border-gray-200/50 shadow-lg bg-white hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-blue-600"></div>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center">
                                            <Award className="h-4 w-4 text-white" />
                                        </div>
                                        Skills
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {userData.skills && userData.skills.map((skill, index) => (
                                            <Badge
                                                key={index}
                                                className="bg-gradient-to-r from-blue-100/70 to-indigo-100/70 text-slate-700 border border-blue-200/50 py-1.5 px-3 text-sm font-medium hover:from-blue-200/70 hover:to-indigo-200/70 transition-all rounded-full"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                        {(!userData.skills || userData.skills.length === 0) && (
                                            <p className="text-sm text-gray-400 italic">No skills added yet</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Main Content Area */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* Professional Information Card */}
                            <Card className="border border-gray-200/50 shadow-lg bg-white hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-600 to-blue-600"></div>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-blue-600 flex items-center justify-center">
                                            <Briefcase className="h-5 w-5 text-white" />
                                        </div>
                                        Professional Information
                                    </CardTitle>
                                    <CardDescription>Career and work experience</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {userData.position || userData.company ? (
                                            <>
                                                {userData.position && (
                                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50/50 border border-gray-200">
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                                                                <Briefcase className="h-5 w-5 text-slate-600" />
                                                            </div>
                                                            <div>
                                                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Position</div>
                                                                <div className="text-base font-semibold text-gray-900">{userData.position}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {userData.company && (
                                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50/50 border border-gray-200">
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                                                                <Building className="h-5 w-5 text-slate-600" />
                                                            </div>
                                                            <div>
                                                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Company</div>
                                                                <div className="text-base font-semibold text-gray-900">{userData.company}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="col-span-2 text-center py-8">
                                                <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-400 italic">No professional information provided</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Education Card */}
                            <Card className="border border-gray-200/50 shadow-lg bg-white hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-blue-600"></div>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center">
                                            <GraduationCap className="h-5 w-5 text-white" />
                                        </div>
                                        Education
                                    </CardTitle>
                                    <CardDescription>Academic background and achievements</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-indigo-50/50 border border-gray-200">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                                                    <Calendar className="h-5 w-5 text-slate-600" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Graduation Year</div>
                                                    <div className="text-base font-semibold text-gray-900">{userData.graduationYear}</div>
                                                </div>
                                            </div>
                                        </div>
                                        {userData.major && (
                                            <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-indigo-50/50 border border-gray-200">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                                                        <BookOpen className="h-5 w-5 text-slate-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Major</div>
                                                        <div className="text-base font-semibold text-gray-900">{userData.major}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Account Information Card */}
                            <Card className="border border-gray-200/50 shadow-lg bg-white hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-slate-600"></div>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-slate-600 flex items-center justify-center">
                                            <Users className="h-5 w-5 text-white" />
                                        </div>
                                        Account Information
                                    </CardTitle>
                                    <CardDescription>Membership details</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-indigo-50/50 border border-gray-200">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                                                    <Users className="h-5 w-5 text-slate-600" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Account Type</div>
                                                    <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 text-sm px-3 py-1 rounded-full">
                                                        {userData.role && userData.role[0].toUpperCase() + userData.role.slice(1)}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-indigo-50/50 border border-gray-200">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                                                    <Calendar className="h-5 w-5 text-slate-600" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Member Since</div>
                                                    <div className="text-base font-semibold text-gray-900">
                                                        {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        }) : 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default OtherUserProfilePage;

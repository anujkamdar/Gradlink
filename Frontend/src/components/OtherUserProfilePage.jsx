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
    XCircle
} from "lucide-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function OtherUserProfilePage() {
    const navigate = useNavigate();
    const { otherUserId } = useParams();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({});
    const [error, setError] = useState(null);

    const getProfile = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/gradlink/api/v1/users/get-profile-data/${otherUserId}`, { withCredentials: true });
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
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50">
                {/* Header section with user banner */}
                <section className="relative">
                    <div className="h-48 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600"></div>
                    <div className="container mx-auto px-4">
                        <div className="relative -mt-24 mb-8 flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                <img
                                    src={userData.avatar}
                                    alt={userData.fullname}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">{userData.fullname}</h1>
                                        <div className="flex flex-wrap items-center gap-2 text-gray-900 mt-2">
                                            <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                                                {userData.role}
                                            </Badge>
                                            <span className="hidden md:inline">•</span>
                                            <span className="flex items-center">
                                                <GraduationCap className="h-4 w-4 mr-1" /> Class of {userData.graduationYear}
                                            </span>
                                            {userData.major && (
                                                <>
                                                    <span className="hidden md:inline">•</span>
                                                    <span className="flex items-center">
                                                        <BookOpen className="h-4 w-4 mr-1" /> {userData.major}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 text-gray-600 mt-2">
                                            {userData.position && (
                                                <span className="flex items-center">
                                                    <Briefcase className="h-4 w-4 mr-1" /> {userData.position}
                                                </span>
                                            )}
                                            {userData.company && (
                                                <>
                                                    {userData.position && <span className="hidden md:inline">•</span>}
                                                    <span className="flex items-center">
                                                        <Building className="h-4 w-4 mr-1" /> {userData.company}
                                                    </span>
                                                </>
                                            )}
                                            {userData.location && (
                                                <>
                                                    <span className="hidden md:inline">•</span>
                                                    <span className="flex items-center">
                                                        <MapPin className="h-4 w-4 mr-1" /> {userData.location}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main profile content */}
                <section className="container mx-auto px-4 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left column - Contact info and skills */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-xl">Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <>
                                        <div className="flex items-start space-x-3">
                                            <Mail className="h-5 w-5 text-purple-600 mt-0.5" />
                                            <div>
                                                <div className="font-medium">Email</div>
                                                <div className="text-gray-600">{userData.email}</div>
                                            </div>
                                        </div>
                                        {userData.location && (
                                            <div className="flex items-start space-x-3">
                                                <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
                                                <div>
                                                    <div className="font-medium">Location</div>
                                                    <div className="text-gray-600">{userData.location}</div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-xl">Skills</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {userData.skills && userData.skills.map((skill, index) => (
                                            <Badge key={index} variant={`secondary`} className="bg-purple-100 text-purple-700 border-purple-200 py-1 px-3">
                                                {skill}
                                            </Badge>
                                        ))}
                                        {(!userData.skills || userData.skills.length === 0) && (
                                            <p className="text-sm text-gray-500">No skills added yet.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-xl">Education</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <>
                                        <div className="flex items-start space-x-3">
                                            <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                                            <div>
                                                <div className="font-medium">Graduation Year</div>
                                                <div className="text-gray-600">{userData.graduationYear}</div>
                                            </div>
                                        </div>
                                        {userData.major && (
                                            <div className="flex items-start space-x-3">
                                                <Award className="h-5 w-5 text-purple-600 mt-0.5" />
                                                <div>
                                                    <div className="font-medium">Major</div>
                                                    <div className="text-gray-600">{userData.major}</div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right column - Bio and Work Experience */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-xl">About Me</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        {userData.bio ? (
                                            <p className="text-gray-700 leading-relaxed">{userData.bio}</p>
                                        ) : (
                                            <p className="text-gray-500 italic">No bio provided</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-xl">Professional Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {userData.position || userData.company ? (
                                            <>
                                                {userData.position && (
                                                    <div className="flex items-start space-x-3">
                                                        <Briefcase className="h-5 w-5 text-purple-600 mt-0.5" />
                                                        <div>
                                                            <div className="font-medium">Current Position</div>
                                                            <div className="text-gray-700">{userData.position}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                {userData.company && (
                                                    <div className="flex items-start space-x-3">
                                                        <Building className="h-5 w-5 text-purple-600 mt-0.5" />
                                                        <div>
                                                            <div className="font-medium">Company</div>
                                                            <div className="text-gray-700">{userData.company}</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-gray-500 italic">No professional information provided</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-xl">Account Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                                        <div>
                                            <div className="font-medium">Account Type</div>
                                            <div className="text-gray-700">
                                                <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                                                    {userData.role === 'employer' ? 'Employer' : 'Alumni'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                                        <div>
                                            <div className="font-medium">Member Since</div>
                                            <div className="text-gray-700">
                                                {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                }) : 'N/A'}
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

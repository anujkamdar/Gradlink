import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import {
  Users,
  Briefcase,
  GraduationCap,
  Mail,
  MapPin,
  Building,
  BookOpen,
  Edit,
  Calendar,
  Award,
  Save,
  PlusCircle,
  X,
  Camera,
  Heart,
  Trophy,
  Star,
} from "lucide-react";
import axios from "axios";
import { Backend_url } from "../info.js";
import toast, { Toaster } from 'react-hot-toast';


function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [isChangeAvatarDialogOpen, setIsChangeAvatarDialogOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

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
      const response = await axios.get(`${Backend_url}/gradlink/api/v1/users/current-user-profile`, { withCredentials: true });
      console.log(response.data.data);
      setUserData(response.data.data);
      setLoading(false);
    } catch (err) {
      console.log(err || "Something went wrong frontend");
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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    setIsEditing(false);
    try {
      const response = await axios.post(`${Backend_url}/gradlink/api/v1/users/update-profile`, userData, { withCredentials: true });
      console.log(response.data);
    } catch (error) {
      console.log(error)
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'graduationYear' || name === 'major') {
      return;
    }

    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;

    if (userData.skills && userData.skills.includes(newSkill.trim().toLowerCase())) {
      toast.error("This skill already exists in your profile!");
      return;
    }

    if (userData.skills && userData.skills.length >= 5) {
      toast.error("You can add a maximum of 5 skills. Please remove a skill before adding a new one.");
      return;
    }

    setUserData(prev => ({
      ...prev,
      skills: [...(prev.skills || []), newSkill.trim().toLowerCase()]
    }));

    setNewSkill("");
    setIsAddingSkill(false);
  };

  const handleRemoveSkill = (skillToRemove) => {
    setUserData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setAvatarFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangeAvatar = async () => {
    if (!avatarFile) {
      toast.error('Please select an image first');
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await axios.post(
        `${Backend_url}/gradlink/api/v1/users/change-avatar`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setUserData(prev => ({
          ...prev,
          avatar: response.data.data
        }));

        setIsChangeAvatarDialogOpen(false);
        setAvatarFile(null);
        setAvatarPreview(null);
        toast.success('Avatar updated successfully!');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to update avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCancelAvatarChange = () => {
    setIsChangeAvatarDialogOpen(false);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  return (
    <>
      <Toaster position='top-right' />
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
                    <div className="relative group flex-shrink-0">
                      <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg transition-transform group-hover:scale-105 duration-300">
                        <img
                          src={userData.avatar}
                          alt={userData.fullname}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => setIsChangeAvatarDialogOpen(true)}
                        className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/60 rounded-full transition-all duration-300 cursor-pointer"
                        title="Change Avatar"
                      >
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center">
                          <Camera className="h-8 w-8 text-white mb-1" />
                          <span className="text-white text-xs font-medium">Change Photo</span>
                        </div>
                      </button>
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
                              {userData.role[0].toUpperCase() + userData.role.slice(1)}
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

                        {/* Action Button */}
                        <div className="flex-shrink-0">
                          {!isEditing ? (
                            <Button
                              className="bg-gradient-to-r from-slate-700 to-blue-600 hover:from-slate-800 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 rounded-xl"
                              onClick={handleEditToggle}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Profile
                            </Button>
                          ) : (
                            <Button
                              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 rounded-xl"
                              onClick={handleSaveProfile}
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                          )}
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
                  {isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        id="bio"
                        name="bio"
                        value={userData.bio || ''}
                        onChange={handleInputChange}
                        rows={5}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                        placeholder="Tell your story... Share your passions, experience, and what drives you."
                      />
                    </div>
                  ) : (
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {userData.bio ? (
                        <p>{userData.bio}</p>
                      ) : (
                        <p className="text-gray-400 italic">Share your story with the community...</p>
                      )}
                    </div>
                  )}
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
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          value={userData.email || ''}
                          className="border-2 border-gray-200 bg-gray-50 cursor-not-allowed"
                          disabled
                        />
                        <p className="text-xs text-gray-400">Email cannot be changed</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          value={userData.location || ''}
                          onChange={handleInputChange}
                          className="border-2 border-gray-200 rounded-xl focus:border-blue-500"
                          placeholder="City, State or Country"
                        />
                      </div>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Skills Card */}
              <Card className="border border-gray-200/50 shadow-lg bg-white hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-blue-600"></div>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                    Skills
                  </CardTitle>
                  {isEditing && (!userData.skills || userData.skills.length < 5) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                      onClick={() => setIsAddingSkill(true)}
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userData.skills && userData.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        className="bg-gradient-to-r from-blue-100/70 to-indigo-100/70 text-slate-700 border border-blue-200/50 py-1.5 px-3 text-sm font-medium hover:from-blue-200/70 hover:to-indigo-200/70 transition-all rounded-full"
                      >
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-2 text-slate-500 hover:text-red-600 transition-colors"
                            aria-label={`Remove ${skill}`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </Badge>
                    ))}
                    {(!userData.skills || userData.skills.length === 0) && (
                      <p className="text-sm text-gray-400 italic">Add your skills to showcase your expertise</p>
                    )}
                  </div>
                  {isEditing && userData.skills && userData.skills.length >= 5 && (
                    <p className="text-xs text-amber-600 mt-3 flex items-center gap-1">
                      <span className="font-semibold">⚠️</span> Maximum 5 skills. Remove one to add another.
                    </p>
                  )}
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
                  <CardDescription>Your career and work experience</CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="position" className="text-sm font-semibold text-gray-700">Current Position</Label>
                        <Input
                          id="position"
                          name="position"
                          value={userData.position || ''}
                          onChange={handleInputChange}
                          className="border-2 border-gray-200 rounded-xl focus:border-blue-500 h-11"
                          placeholder="e.g., Senior Software Engineer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-sm font-semibold text-gray-700">Company</Label>
                        <Input
                          id="company"
                          name="company"
                          value={userData.company || ''}
                          onChange={handleInputChange}
                          className="border-2 border-gray-200 rounded-xl focus:border-blue-500 h-11"
                          placeholder="e.g., Google"
                        />
                      </div>
                    </div>
                  ) : (
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
                          <p className="text-gray-400 italic">Add your professional information to help others connect with you</p>
                        </div>
                      )}
                    </div>
                  )}
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
                  <CardDescription>Your academic background and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="graduationYear" className="text-sm font-semibold text-gray-700">Graduation Year</Label>
                        <Input
                          id="graduationYear"
                          name="graduationYear"
                          type="number"
                          value={userData.graduationYear || ''}
                          className="border-2 border-gray-200 bg-gray-50 cursor-not-allowed h-11"
                          disabled
                        />
                        <p className="text-xs text-gray-400">Cannot be changed</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="major" className="text-sm font-semibold text-gray-700">Major / Field of Study</Label>
                        <Input
                          id="major"
                          name="major"
                          value={userData.major || ''}
                          className="border-2 border-gray-200 bg-gray-50 cursor-not-allowed h-11"
                          disabled
                        />
                        <p className="text-xs text-gray-400">Cannot be changed</p>
                      </div>
                    </div>
                  ) : (
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
                  )}
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
                  <CardDescription>Your membership details</CardDescription>
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
                            {userData.role[0].toUpperCase() + userData.role.slice(1)}
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

      {/* Dialog for adding new skill */}
      <Dialog open={isAddingSkill} onOpenChange={(state) => { setIsAddingSkill(state) }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add a New Skill</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newSkill">Skill Name</Label>
              <Input
                id="newSkill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Enter a skill (e.g. JavaScript, React, UI Design)"
                className="border-2 border-gray-200 rounded-xl focus:border-blue-500"
              />
              <p className="text-xs text-gray-500">
                {userData.skills ? userData.skills.length : 0}/5 skills added.
                You can add {5 - (userData.skills ? userData.skills.length : 0)} more.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingSkill(false)}>Cancel</Button>
            <Button onClick={handleAddSkill}>Add Skill</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isChangeAvatarDialogOpen} onOpenChange={(state) => {
        setIsChangeAvatarDialogOpen(state); if (!state) {
          setAvatarFile(null);
          setAvatarPreview(null);
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Avatar</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Current Avatar Preview */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                <img
                  src={avatarPreview || userData.avatar}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* File Input */}
            <div className="space-y-2">
              <Label htmlFor="avatarFile">Select New Avatar</Label>
              <Input
                id="avatarFile"
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="border-2 border-gray-200 rounded-xl focus:border-blue-500"
              />
              <p className="text-xs text-gray-500">
                Supported formats: JPG, PNG, GIF. Max size: 5MB
              </p>
            </div>

            {avatarFile && (
              <div className="text-sm text-green-600">
                ✓ Image selected: {avatarFile.name}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelAvatarChange}
              disabled={isUploadingAvatar}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangeAvatar}
              disabled={!avatarFile || isUploadingAvatar}
            >
              {isUploadingAvatar ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Avatar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ProfilePage;

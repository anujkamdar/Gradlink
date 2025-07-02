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
} from "lucide-react";
import axios from "axios";
import { Backend_url } from "../info.js";

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});

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
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;

    if (userData.skills && userData.skills.includes(newSkill.trim().toLowerCase())) {
      alert("This skill already exists in your profile!");
      return;
    }

    if (userData.skills && userData.skills.length >= 5) {
      alert("You can add a maximum of 5 skills. Please remove a skill before adding a new one.");
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

                  <div className="mt-4 md:mt-0">
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        onClick={handleEditToggle}
                      >
                        <Edit className="h-4 w-4 mr-2" /> Edit Profile
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSaveProfile}
                      >
                        <Save className="h-4 w-4 mr-2" /> Save Changes
                      </Button>
                    )}
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
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          value={userData.email || ''}
                          onChange={handleInputChange}
                          className="border-purple-200 focus:border-purple-500"
                          disabled
                        />
                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          value={userData.location || ''}
                          onChange={handleInputChange}
                          className="border-purple-200 focus:border-purple-500"
                          placeholder="e.g., New York, NY"
                        />
                      </div>
                    </>
                  ) : (
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
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">Skills</CardTitle>
                  {isEditing && (!userData.skills || userData.skills.length < 5) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-dashed border-purple-300 text-purple-600"
                      onClick={() => setIsAddingSkill(true)}
                    >
                      <PlusCircle className="h-3 w-3 mr-1" /> Add Skill
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userData.skills && userData.skills.map((skill, index) => (
                      <Badge key={index} variant={`secondary`} className="bg-purple-100 text-purple-700 border-purple-200 py-1 px-3">
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-2 text-purple-700 hover:text-red-500 transition-colors"
                            aria-label={`Remove ${skill} skill`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                    {(!userData.skills || userData.skills.length === 0) && (
                      <p className="text-sm text-gray-500">No skills added yet.</p>
                    )}
                  </div>
                  {isEditing && userData.skills && userData.skills.length >= 5 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Maximum of 5 skills reached. Remove a skill to add a new one.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Education</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="graduationYear">Graduation Year</Label>
                        <Input
                          id="graduationYear"
                          name="graduationYear"
                          type="number"
                          value={userData.graduationYear || ''}
                          onChange={handleInputChange}
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="major">Major/Field of Study</Label>
                        <Input
                          id="major"
                          name="major"
                          value={userData.major || ''}
                          onChange={handleInputChange}
                          className="border-purple-200 focus:border-purple-500"
                          placeholder="e.g., Computer Science"
                        />
                      </div>
                    </>
                  ) : (
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
                  )}
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
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={userData.bio || ''}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full p-2 border border-purple-200 rounded-md focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        placeholder="Tell others about yourself, your interests, and your experience..."
                      />
                    </div>
                  ) : (
                    <div>
                      {userData.bio ? (
                        <p className="text-gray-700 leading-relaxed">{userData.bio}</p>
                      ) : (
                        <p className="text-gray-500 italic">No bio provided</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Professional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="position">Current Position</Label>
                        <Input
                          id="position"
                          name="position"
                          value={userData.position || ''}
                          onChange={handleInputChange}
                          className="border-purple-200 focus:border-purple-500"
                          placeholder="e.g., Software Engineer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          name="company"
                          value={userData.company || ''}
                          onChange={handleInputChange}
                          className="border-purple-200 focus:border-purple-500"
                          placeholder="e.g., Google"
                        />
                      </div>
                    </div>
                  ) : (
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
                  )}
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
                className="border-purple-200 focus:border-purple-500"
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
    </>
  );
}

export default ProfilePage;

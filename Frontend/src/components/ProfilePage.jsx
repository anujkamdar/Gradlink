import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  Users,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Building,
  BookOpen,
  Edit,
  Calendar,
  User,
  Award,
  Link,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Globe,
  Save,
  PlusCircle,
  MessageSquare,
  X,
  Trash2
} from "lucide-react";
import axios from "axios";


// firstly just focusing on skills part
// first i will implement this then will do the predefined tags for skills
function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [userData, setUserData] = useState({
  //   firstName: "Rajesh",
  //   lastName: "Kumar",
  //   email: "rajesh.kumar@example.com",
  //   phone: "+91 9119315581",
  //   location: "Delhi, India",
  //   role: "Software Engineer",
  //   company: "TechStart Inc.",
  //   bio: "Passionate software engineer with experience in building scalable web applications. Alumni of Computer Science department (2018). Currently working as a Senior Software Engineer at TechStart Inc.",
  //   batch: "2018",
  //   degree: "B.Tech",
  //   department: "Computer Science",
  //   socialLinks: {
  //     linkedin: "linkedin.com/in/rajeshkumar",
  //     github: "github.com/rajeshkumar",
  //     twitter: "twitter.com/rajeshkumar",
  //     website: "rajeshkumar.dev"
  //   },
  //   experiences: [
  //     {
  //       id: 1,
  //       role: "Senior Software Engineer",
  //       company: "TechStart Inc.",
  //       duration: "2020 - Present",
  //       description: "Leading the frontend development team and implementing scalable solutions."
  //     },
  //     {
  //       id: 2,
  //       role: "Software Developer",
  //       company: "InnovateX",
  //       duration: "2018 - 2020",
  //       description: "Developed and maintained web applications using React and Node.js."
  //     }
  //   ],
  //   education: [
  //     {
  //       id: 1,
  //       degree: "B.Tech",
  //       institution: "University College",
  //       field: "Computer Science",
  //       year: "2014 - 2018"
  //     }
  //   ],
  //   skills: ["Javascript", "Reactjs  "]
  // });

  const [userData, setUserData] = useState({});
  const getProfile = async () => {
    try {
      const response = await axios.get("http://localhost:8000/gradlink/api/v1/users/current-user-profile", { withCredentials: true });
      const user = response.data.data;
      console.log(response.data.data);
      setUserData(user);
      setLoading(false);
    } catch (err) {
      console.log(err || "Something went wrong frontend");
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
      const response = await axios.post("http://localhost:8000/gradlink/api/v1/users/update-profile", userData, { withCredentials: true });
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

  const handleSocialLinkChange = (platform, value) => {
    setUserData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const addExperience = () => {
    const newExperience = {
      id: userData.experiences.length + 1,
      role: "",
      company: "",
      duration: "",
      description: ""
    };

    setUserData(prev => ({
      ...prev,
      experiences: [...prev.experiences, newExperience]
    }));
  };

  const updateExperience = (id, field, value) => {
    setUserData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;

    // Check if skill already exists
    if (userData.skills.includes(newSkill.trim())) {
      alert("This skill already exists in your profile!");
      return;
    }

    // Check if we've reached the maximum of 5 skills
    if (userData.skills.length >= 5) {
      alert("You can add a maximum of 5 skills. Please remove a skill before adding a new one.");
      return;
    }

    setUserData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill.trim()]
    }));

    setNewSkill("");
    setIsAddingSkill(false);
  }; //nice use of destructuring maybe use it more

  const handleRemoveSkill = (skillToRemove) => {
    setUserData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  }; // see

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50">
        {/* Header section with user banner */}
        <section className="relative">
          <div className="h-48 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600"></div>
          <div className="container mx-auto px-4">
            <div className="relative -mt-24 mb-8 flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                {/* This would be the user's profile picture */}
                <div className="w-full h-full bg-purple-200 flex items-center justify-center">
                  <User className="h-16 w-16 text-purple-600" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{userData.fullname}</h1>
                    <div className="flex items-center space-x-2 text-gray-600 mt-1">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                        <GraduationCap className="h-3 w-3 mr-1" /> {userData.role}
                      </Badge>
                      <span>•</span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" /> Batch of {userData.graduationYear}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" /> {userData.major}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 mt-1">
                      {/* <span className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" /> {userData.role}
                      </span> */}
                      <span>•</span>
                      <span className="flex items-center">
                        <Building className="h-4 w-4 mr-1" /> {userData.company}
                      </span>
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
                        className="bg-purple-600 hover:bg-purple-700"
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
            {/* Left column - Contact info and social media */}
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
                          value={userData.email}
                          onChange={handleInputChange}
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>
                      {/* <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={userData.phone}
                          onChange={handleInputChange}
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          value={userData.location}
                          onChange={handleInputChange}
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div> */}
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
                      {/* <div className="flex items-start space-x-3">
                        <Phone className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <div className="font-medium">Phone</div>
                          <div className="text-gray-600">{userData.phone}</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <div className="font-medium">Location</div>
                          <div className="text-gray-600">{userData.location}</div>
                        </div>
                      </div> */}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Social Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin" className="flex items-center">
                          <Linkedin className="h-4 w-4 mr-2 text-blue-600" /> LinkedIn
                        </Label>
                        <Input
                          id="linkedin"
                          value={userData.socialLinks.linkedin}
                          onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="github" className="flex items-center">
                          <Github className="h-4 w-4 mr-2 text-gray-800" /> GitHub
                        </Label>
                        <Input
                          id="github"
                          value={userData.socialLinks.github}
                          onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter" className="flex items-center">
                          <Twitter className="h-4 w-4 mr-2 text-blue-400" /> Twitter
                        </Label>
                        <Input
                          id="twitter"
                          value={userData.socialLinks.twitter}
                          onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website" className="flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-purple-600" /> Website
                        </Label>
                        <Input
                          id="website"
                          value={userData.socialLinks.website}
                          onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {userData.socialLinks.linkedin && (
                        <a href={`https://${userData.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors">
                          <Linkedin className="h-5 w-5 text-blue-600" />
                          <span>{userData.socialLinks.linkedin}</span>
                        </a>
                      )}
                      {userData.socialLinks.github && (
                        <a href={`https://${userData.socialLinks.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-colors">
                          <Github className="h-5 w-5 text-gray-800" />
                          <span>{userData.socialLinks.github}</span>
                        </a>
                      )}
                      {userData.socialLinks.twitter && (
                        <a href={`https://${userData.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-gray-700 hover:text-blue-400 transition-colors">
                          <Twitter className="h-5 w-5 text-blue-400" />
                          <span>{userData.socialLinks.twitter}</span>
                        </a>
                      )}
                      {userData.socialLinks.website && (
                        <a href={`https://${userData.socialLinks.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors">
                          <Globe className="h-5 w-5 text-purple-600" />
                          <span>{userData.socialLinks.website}</span>
                        </a>
                      )}
                    </>
                  )}
                </CardContent>
              </Card> */}

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userData.skills.map((skill, index) => (
                      <Badge key={index} variant={`secondary`} className="bg-purple-100 text-purple-700 border-purple-200 py-1 px-3">
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-2 text-purple-700 hover:text-red-500 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                    {isEditing && userData.skills.length < 5 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-dashed border-purple-300 text-purple-600"
                        onClick={() => setIsAddingSkill(true)}
                      >
                        <PlusCircle className="h-3 w-3 mr-1" /> Add Skill
                      </Button>
                    )}
                  </div>
                  {isEditing && userData.skills.length >= 5 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Maximum of 5 skills reached. Remove a skill to add a new one.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Dialog for adding skills */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add a New Skill</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="new-skill">Skill Name</Label>
                      <Input
                        id="new-skill"
                        placeholder="Enter skill name"
                        className="border-purple-200 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      <X className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                    <Button
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => {
                        const skillInput = document.getElementById('new-skill');
                        const skillValue = skillInput.value.trim();
                        addSkill(skillValue);
                        skillInput.value = '';
                        setIsDialogOpen(false);
                      }}
                    >
                      <Save className="h-4 w-4 mr-2" /> Save Skill
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Right column - Bio, Experience, and Education */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={userData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full p-2 border border-purple-200 rounded-md focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">{userData.bio}</p>
                  )}
                </CardContent>
              </Card>

              {/* <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">Work Experience</CardTitle>
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                      onClick={addExperience}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Experience
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {userData.experiences.map((exp, index) => (
                    <div key={exp.id} className={`${index > 0 ? 'border-t pt-6' : ''}`}>
                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`role-${exp.id}`}>Role</Label>
                              <Input
                                id={`role-${exp.id}`}
                                value={exp.role}
                                onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                                className="border-purple-200 focus:border-purple-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`company-${exp.id}`}>Company</Label>
                              <Input
                                id={`company-${exp.id}`}
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                className="border-purple-200 focus:border-purple-500"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`duration-${exp.id}`}>Duration</Label>
                            <Input
                              id={`duration-${exp.id}`}
                              value={exp.duration}
                              onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                              className="border-purple-200 focus:border-purple-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`description-${exp.id}`}>Description</Label>
                            <textarea
                              id={`description-${exp.id}`}
                              value={exp.description}
                              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                              rows={3}
                              className="w-full p-2 border border-purple-200 rounded-md focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">{exp.role}</h3>
                            <Badge variant="outline" className="mt-1 sm:mt-0 border-purple-200 text-purple-700">
                              {exp.duration}
                            </Badge>
                          </div>
                          <div className="flex items-center text-gray-600 mb-3">
                            <Building className="h-4 w-4 mr-2" />
                            <span>{exp.company}</span>
                          </div>
                          <p className="text-gray-700">{exp.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card> */}

              {/* <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Education</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {userData.education.map((edu, index) => (
                    <div key={edu.id} className={index > 0 ? 'border-t pt-6' : ''}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{edu.degree} in {edu.field}</h3>
                        <Badge variant="outline" className="mt-1 sm:mt-0 border-purple-200 text-purple-700">
                          {edu.year}
                        </Badge>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        <span>{edu.institution}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card> */}

              {/* <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Get in Touch</CardTitle>
                  <CardDescription>Send a message to connect with Rajesh</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="message-subject">Subject</Label>
                      <Input
                        id="message-subject"
                        placeholder="Enter message subject"
                        className="border-purple-200 focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message-content">Message</Label>
                      <textarea
                        id="message-content"
                        placeholder="Write your message here..."
                        rows={4}
                        className="w-full p-2 border border-purple-200 rounded-md focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600">
                      <MessageSquare className="h-4 w-4 mr-2" /> Send Message
                    </Button>                </div>
                </CardContent>
              </Card> */}
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
                {userData.skills.length}/5 skills added. You can add {5 - userData.skills.length} more.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingSkill(false)}>Cancel</Button>
            <Button onClick={handleAddSkill}>Add Skill</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog >
    </>
  );
}

export default ProfilePage;

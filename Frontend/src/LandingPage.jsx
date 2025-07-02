import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { useNavigate, useNavigation } from "react-router-dom"
import { Button } from "./components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Tabs, TabsContent } from "./components/ui/tabs"
import { Badge } from "./components/ui/badge"
import {
  Users,
  Heart,
  Network,
  Briefcase,
  Search,
  Trophy,
  Calendar,
  MessageSquare,
  GraduationCap,
  Shield,
  UserCheck,
  Mail,
  Phone,
  MapPin,
  Star,
  ArrowRight,
  CheckCircle,
  Menu,
  X,
  Globe,
  TrendingUp,
  Award,
  Building,
} from "lucide-react"


function LandingPage() {

  const navigate = useNavigate();
  const navigation = useNavigation();
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const passwordRef = useRef(null);
  const registerPasswordRef = useRef(null);
  const [graduationYear, setGraduationYear] = useState("");
  const [major, setMajor] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [college, setCollege] = useState("");
  const [collegeIndex, setCollegeIndex] = useState(null);
  const [collegeList, setCollegeList] = useState([]);
  const [loadingAuth, setLoadingAuth] = useState(false);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get("http://localhost:8000/gradlink/api/v1/users/get-all-colleges");
        setCollegeList(response.data.data);
        console.log("Colleges fetched:", response.data.data);
      } catch (error) {
        console.error("Error fetching colleges:", error);
        alert("Failed to load colleges. Please try again later.");
      }
    };
    fetchColleges();
    
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);




  const signInUser = async () => {
    setPassword(passwordRef.current.value)
    if (!email) {
      alert("Enter Email");
      return;
    }
    if (!passwordRef.current.value) {
      alert("Enter Password");
      return;
    }

    console.log(email, passwordRef.current.value);
    try {
      setLoadingAuth(true);
      const response = await axios.post("http://localhost:8000/gradlink/api/v1/users/login", { email: email, password: passwordRef.current.value }, { withCredentials: true });
      console.log(response.data);
      setLoadingAuth(false);
      navigate("/tabs/home")
    } catch (error) {
      setLoadingAuth(false);
      alert(error?.response?.data?.message || "Network error");
    }
  }

  const registerUser = async () => {
    if (!email) {
      alert("Enter Email");
      return;
    }
    if (!registerPasswordRef.current.value) {
      alert("Enter Password");
      return;
    }
    if (selectedRole === "") {
      alert("Select a role");
      return;
    }
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;

    if (!firstName || !lastName) {
      alert("Enter First and Last Name");
      return;
    }

    if (!graduationYear) {
      alert("Select Graduation Year");
      return;
    }


    if (!college) {
      alert("Select College");
      return;
    }

    if (!major) {
      alert("Select Major");
      return;
    }
    if (!avatar) {
      alert("Please upload a profile picture");
      return;
    }

    // Prepare data to send
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", registerPasswordRef.current.value);
    formData.append("fullname", `${firstName.trim()} ${lastName.trim()}`);
    formData.append("role", selectedRole);
    formData.append("graduationYear", graduationYear ? graduationYear.toString() : "");
    formData.append("avatar", avatar);
    formData.append("collegeId", college);
    formData.append("major", major);

    try {
      setLoadingAuth(true);
      let response = await axios.post("http://localhost:8000/gradlink/api/v1/users/register", formData);
      console.log(response.data);
      response = await axios.post("http://localhost:8000/gradlink/api/v1/users/login", { email: email, password: registerPasswordRef.current.value }, { withCredentials: true });
      console.log(response.data);
      setLoadingAuth(false);
      navigate("/tabs/home");
    } catch (error) {
      alert(error.response?.data?.message || "Network Error");
      setLoadingAuth(false);
    }
  }


  const features = [
    {
      icon: Users,
      title: "Alumni Profiles",
      description: "Create detailed profiles showcasing your education, skills, current position, company, and location. Connect with fellow graduates and build your professional network.",
      color: "bg-blue-100 text-blue-600",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    },
    {
      icon: Briefcase,
      title: "Job Portal",
      description: "Discover career opportunities shared exclusively by alumni networks and top recruiting companies.",
      color: "bg-indigo-100 text-indigo-600",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    },
    {
      icon: Heart,
      title: "Fundraising Hub",
      description: "Support your alma mater through secure online donations for scholarships, research, and infrastructure.",
      color: "bg-blue-100 text-blue-600",
      image: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80"
    },
    {
      icon: MessageSquare,
      title: "Social Sharing",
      description: "Share posts, updates, and achievements with fellow students and alumni through our integrated social platform.",
      color: "bg-indigo-100 text-indigo-600",
      image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80"
    },
    {
      icon: Building,
      title: "College News",
      description: "Stay updated with the latest news, developments, and announcements from your alma mater.",
      color: "bg-blue-100 text-blue-600",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80"
    }
  ]





  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className={`${isScrolled ? 'bg-white/95 shadow-lg' : 'bg-white/80 shadow-md'} backdrop-blur-lg sticky top-0 z-50 border-b border-blue-50 transition-all duration-300`}>
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md transform ${isScrolled ? 'scale-95' : 'hover:scale-105'} transition-all duration-300`}>
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Gradlink
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <a
              href="#benefits"
              onClick={(e) => handleNavClick(e, 'benefits')}
              className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium relative group"
            >
              Benefits
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#features"
              onClick={(e) => handleNavClick(e, 'features')}
              className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium relative group"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#cta"
              onClick={(e) => handleNavClick(e, 'cta')}
              className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium relative group"
            >
              Join Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-5">
            <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="hover:cursor-pointer border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 px-6 rounded-full"
                >
                  Sign In
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-xl border-blue-100 shadow-lg">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-2xl font-bold text-gray-800">Welcome Back</DialogTitle>
                  <DialogDescription className="text-gray-600">Sign in to your AlumniConnect account</DialogDescription>
                </DialogHeader>
                {(
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        className="border-blue-200 focus:border-blue-500 rounded-lg"
                        onChange={(e) => { setEmail(e.target.value) }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="text-gray-700">
                        Password
                      </Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        className="border-blue-200 focus:border-blue-500 rounded-lg"
                        ref={passwordRef}
                      />
                    </div>
                    <Button
                      className="w-full bg-black opacity-90"
                      onClick={(e) => { signInUser() }}
                      disabled={loadingAuth}
                    >
                      {loadingAuth ? "Signing In..." : "Sign In"}
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <Dialog
              open={isRegisterOpen}
              onOpenChange={(state) => {
                setIsRegisterOpen(state)
                if (!state) {
                  setAvatar(null);
                }
              }}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 rounded-full shadow-md hover:shadow-blue-200/50 transition-all duration-300">
                  Get Started
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-xl border-blue-100 shadow-lg">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-800">Join AlumniConnect</DialogTitle>
                  <DialogDescription className="text-gray-600">Create your account and connect with the community</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="role-select" className="w-full">
                  <TabsContent value="role-select" className="space-y-4">
                    <div className="space-y-4">
                      <Label className="text-gray-700">I am a...</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          variant={selectedRole === "alumni" ? "default" : "outline"}
                          className={`flex flex-col items-center p-4 h-auto ${selectedRole === "alumni"
                            ? "bg-black"
                            : "border-purple-200 hover:bg-purple-50"
                            }`}
                          onClick={() => setSelectedRole("alumni")}
                        >
                          <UserCheck className="h-6 w-6 mb-2" />
                          <span className="text-sm">Alumni</span>
                        </Button>
                        <Button
                          variant={selectedRole === "student" ? "default" : "outline"}
                          className={`flex flex-col items-center p-4 h-auto ${selectedRole === "student"
                            ? "bg-black"
                            : "border-purple-200 hover:bg-purple-50"
                            }`}
                          onClick={() => setSelectedRole("student")}
                        >
                          <GraduationCap className="h-6 w-6 mb-2" />
                          <span className="text-sm">Student</span>
                        </Button>
                      </div>
                    </div>
                    {selectedRole && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="first-name">
                              First Name
                            </Label>
                            <Input
                              id="first-name"
                              placeholder="John"
                              className="border-purple-200 focus:border-purple-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last-name">
                              Last Name
                            </Label>
                            <Input
                              id="last-name"
                              placeholder="Doe"
                              className="border-purple-200 focus:border-purple-500"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-email">
                            Email
                          </Label>
                          <Input
                            id="register-email"
                            type="email"
                            placeholder="john@example.com"
                            className="border-purple-200 focus:border-purple-500"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                          />
                        </div>
                        {selectedRole === "alumni" && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="graduation-year">
                                  Graduation Year
                                </Label>
                                <Select onValueChange={(value) => { setGraduationYear(value) }}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select year" />
                                  </SelectTrigger>
                                  <SelectContent id="grad-year">
                                    {Array.from({ length: 100 }, (_, i) => 2024 - i).map((year) => ( // if i wanna scale yha 100 ki jgah how many years that institiution has been open
                                      <SelectItem key={year} value={year.toString()}>
                                        {year}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="college">
                                  College
                                </Label>
                                <Select onValueChange={(value) => {
                                  setCollege(value);
                                  const index = collegeList.findIndex(c => c._id === value);
                                  setCollegeIndex(index);
                                  setMajor(null)
                                }}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select college" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {collegeList.map((college, index) => (
                                      <SelectItem key={college._id} value={college._id}>{college.collegeName}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </>
                        )}
                        {selectedRole === "student" && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="graduation-year">
                                  Graduation Year
                                </Label>
                                <Select onValueChange={(value) => { setGraduationYear(value) }}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select year" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from({ length: 8 }, (_, i) => 2024 + i).map((year) => (
                                      <SelectItem key={year} value={year.toString()}>
                                        {year}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="college">
                                  College
                                </Label>
                                <Select onValueChange={(value) => {
                                  setCollege(value)
                                  const index = collegeList.findIndex(c => c._id === value);
                                  setCollegeIndex(index);
                                  setMajor(null)
                                }}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select college" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {collegeList.map((college) => (
                                      <SelectItem key={college._id} value={college._id}>
                                        {college.collegeName}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>


                            </div>
                          </>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="avatar">
                              Profile Picture
                            </Label>
                            <Input
                              id="avatar"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setAvatar(e.target.files[0]);
                                }
                              }}
                            />
                            {avatar && (
                              <img src={URL.createObjectURL(avatar)} alt="Avatar Preview" className="mt-2 w-24 h-24 object-cover rounded-full" />
                            )}
                          </div>
                          {(collegeIndex == 0 || collegeIndex) ? (
                            <div className="space-y-2">
                              <Label htmlFor="major">
                                Major
                              </Label>
                              <Select onValueChange={(value) => { setMajor(value) }}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select major" />
                                </SelectTrigger>
                                <SelectContent>
                                  {collegeList[collegeIndex].majors.map((major) => (
                                    <SelectItem key={major} value={major}>
                                      {major}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          ) : <></>}


                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-password">
                            Password
                          </Label>
                          <Input
                            id="register-password"
                            type="password"
                            placeholder="Create a password"
                            ref={registerPasswordRef}
                          />
                        </div>
                        <Button onClick={(e) => { e.preventdefaut; registerUser() }} className="w-full"
                          disabled={loadingAuth}>
                          {loadingAuth ? "Registering..." : "Register"}
                          </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-blue-50 transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6 text-blue-600" /> : <Menu className="h-6 w-6 text-blue-600" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-blue-50 px-6 py-6 shadow-lg"
            style={{ animation: 'fadeIn 0.3s ease-out forwards' }}>
            <style jsx>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            <nav className="flex flex-col space-y-5">
              <a
                href="#benefits"
                onClick={(e) => handleNavClick(e, 'benefits')}
                className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium py-2 border-b border-gray-100"
              >
                Benefits
              </a>
              <a
                href="#features"
                onClick={(e) => handleNavClick(e, 'features')}
                className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium py-2 border-b border-gray-100"
              >
                Features
              </a>
              <a
                href="#cta"
                onClick={(e) => handleNavClick(e, 'cta')}
                className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium py-2 border-b border-gray-100"
              >
                Join Us
              </a>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium py-2 border-b border-gray-100"
              >
                Contact
              </a>
              <div className="flex flex-col space-y-3 pt-4">
                <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      Sign In
                    </Button>
                  </DialogTrigger>
                </Dialog>
                <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg"
                    >
                      Get Started
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </nav>
          </div>
        )}
      </header>


      {/* Hero Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/50 z-0"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl z-0"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl z-0"></div>

        <div className="container mx-auto text-center relative z-10">
          <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 rounded-full shadow-sm">
            🎓 Connecting Alumni Worldwide
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Strengthen Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500">
              {" "}
              Alumni Network
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            A comprehensive platform that enables alumni to register, connect, contribute, and engage with the college
            and fellow alumni. Build lasting relationships, advance careers, and give back to your alma mater.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="text-lg px-10 py-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 rounded-full shadow-xl hover:shadow-blue-200/50 hover:translate-y-[-2px] transition-all duration-300"
                >
                  Join the Network
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </DialogTrigger>
            </Dialog>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-6 border-blue-200 text-slate-800 hover:bg-blue-50 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
            >
              Explore Features
            </Button>
          </div>
        </div>
      </section>



      {/* Benefits Section */}
      <section id="benefits" className="py-24 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center p-2 sm:p-4 md:p-6">
            <div className="p-3 sm:p-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium text-sm mb-4">
                Why Join Us
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Benefits that extend beyond graduation
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our platform creates a bridge between your academic past and professional future, opening doors to opportunities that would otherwise remain closed.
              </p>

              <div className="space-y-6">
                <div className="flex p-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-indigo-50 w-10 h-10 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Professional Networking</h3>
                    <p className="text-gray-600">Connect with alumni in your field or industry for mentorship and career growth.</p>
                  </div>
                </div>

                <div className="flex p-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-indigo-50 w-10 h-10 rounded-lg flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Exclusive Opportunities</h3>
                    <p className="text-gray-600">Access job postings and career opportunities specifically shared for alumni.</p>
                  </div>
                </div>

                <div className="flex p-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-indigo-50 w-10 h-10 rounded-lg flex items-center justify-center">
                      <Heart className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Give Back</h3>
                    <p className="text-gray-600">Mentor students, donate to causes, and help shape the future of your alma mater.</p>
                  </div>
                </div>

                <div className="flex p-2">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-indigo-50 w-10 h-10 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Lifelong Community</h3>
                    <p className="text-gray-600">Stay connected with friends and make new connections with shared experiences.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative hidden md:block p-3 sm:p-4">
              <div className="absolute -inset-4 bg-indigo-50 rounded-xl transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                alt="Alumni networking"
                className="relative rounded-xl shadow-lg object-cover h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
        <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl"></div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center px-3 py-1 mb-3 rounded-full bg-indigo-50 text-indigo-700 font-medium text-sm">
              Powerful Capabilities
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Key Platform Features</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our platform offers essential tools designed to strengthen alumni relationships, support career growth, and
              foster community engagement.
            </p>
          </div>

          <div className="space-y-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-6 items-center p-3 sm:p-4 md:p-5`}
              >
                <div className="w-full lg:w-1/2">
                  <div className="relative">
                    <div className={`absolute inset-0 ${index % 2 === 0 ? 'translate-x-4 translate-y-4' : '-translate-x-4 translate-y-4'} rounded-2xl ${feature.color.replace('text-blue-600', 'bg-blue-100/50').replace('text-indigo-600', 'bg-indigo-100/50')}`}></div>
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="relative z-10 w-full h-64 lg:h-80 object-cover rounded-2xl shadow-xl"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-1/2 space-y-4 p-2 sm:p-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-md ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section id="cta" className="py-24 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Connect with Your Alumni Network?</h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90">
            Join thousands of alumni who are already benefiting from our comprehensive platform. Start building
            meaningful connections and advancing your career today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="text-lg px-10 py-6 bg-white text-blue-600 hover:bg-gray-100 shadow-lg rounded-full hover:shadow-white/20 transition-all duration-300">
                  Create Your Profile
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </DialogTrigger>
            </Dialog>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-6 bg-transparent text-white hover:bg-white/10 border-2 border-white/30 shadow-lg rounded-full hover:shadow-white/20 transition-all duration-300"
              onClick={() => navigate("/college-register")}
            >
              Register as College
              <Building className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-geometric.png')] opacity-5"></div>
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="max-w-md">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="h-7 w-7 text-white" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">Gradlink</span>
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Connecting alumni worldwide and strengthening institutional bonds through technology and community
                engagement.
              </p>
            </div>
            <div className="flex flex-row flex-wrap gap-6  md:mt-20 sm:pr-4 md:pr-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm text-slate-300">contact@gradlink.edu</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm text-slate-300">+91 91193XXXXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm text-slate-300">Jaipur, Rajasthan, India</span>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-16 pt-8 text-center text-slate-400">
            <p>&copy; 2025 Gradlink   Built with ❤️ for our alumni community.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

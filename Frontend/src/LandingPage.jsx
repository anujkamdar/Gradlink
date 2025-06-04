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


// to make it expandable just add the which college in register and then change the controllers in backend to make it for many colleges

function LandingPage() {

  const navigate = useNavigate();
  const navigation = useNavigation();
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const passwordRef = useRef(null);
  const registerPasswordRef = useRef(null);
  const [graduationYear, setGraduationYear] = useState("");
  const [major, setMajor] = useState("");
  const [avatar, setAvatar] = useState(null);
  const avatarRef = useRef(null);


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
      const response = await axios.post("http://localhost:8000/gradlink/api/v1/users/login", { email: email, password: passwordRef.current.value },{withCredentials: true});
      console.log(response.data);
      navigate("/tabs/home")
    } catch (error) {
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

    if (selectedRole === "alumni" || selectedRole === "student") {
      if (!graduationYear) {
        alert("Select Graduation Year");
        return;
      }
      if (!major) {
        alert("Enter Major");
        return;
      }
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
    formData.append("major", major.trim());
    formData.append("graduationYear", graduationYear ? graduationYear.toString() : "");
    formData.append("avatar", avatar);

    try {
      let response = await axios.post("http://localhost:8000/gradlink/api/v1/users/register", formData);
      console.log(response.data);
      response = await axios.post("http://localhost:8000/gradlink/api/v1/users/login", { email: email, password: registerPasswordRef.current.value });
      console.log(response.data);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Network Error");
    }
  }

  
  const features = [
    {
      icon: Users,
      title: "Alumni Registration",
      description: "Seamless registration process to onboard new alumni and create comprehensive profiles.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Heart,
      title: "Donation Portal",
      description: "Secure online donation system to support various college initiatives and causes.",
      color: "bg-violet-100 text-violet-600",
    },
    {
      icon: Network,
      title: "Networking Hub",
      description: "Connect alumni by interest, profession, or location for mentorship and collaboration.",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: Briefcase,
      title: "Job Portal",
      description: "Integrated job search and posting functionality for career opportunities.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Search,
      title: "Alumni Directory",
      description: "Advanced search and filtering to find alumni by graduation year, field, and location.",
      color: "bg-violet-100 text-violet-600",
    },
    {
      icon: Trophy,
      title: "Success Stories",
      description: "Showcase alumni achievements and contributions to inspire the community.",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: Calendar,
      title: "Events & Reunions",
      description: "Tools to announce, register, and manage alumni events and workshops.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: MessageSquare,
      title: "Feedback & Surveys",
      description: "Channels for alumni to provide feedback and participate in community surveys.",
      color: "bg-violet-100 text-violet-600",
    },
  ]

  const stats = [
    { number: "15,000+", label: "Active Alumni", icon: Users },
    { number: "750+", label: "Companies Connected", icon: Building },
    { number: "₹5.2Cr+", label: "Donations Raised", icon: TrendingUp },
    { number: "200+", label: "Events Organized", icon: Award },
  ]

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Senior Software Engineer, Microsoft",
      year: "Class of 2018",
      content:
        "This platform revolutionized how I connect with my alma mater. The mentorship opportunities helped me transition into leadership roles.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO, TechStart",
      year: "Class of 2015",
      content:
        "Through the job portal, I found incredible talent for my startup. The alumni network is incredibly supportive and collaborative.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Dr. Anita Patel",
      role: "Research Director, ISRO",
      year: "Class of 2012",
      content:
        "Being able to give back through donations and share my journey has been deeply fulfilling. This platform makes it so easy.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  const benefits = [
    {
      title: "Professional Growth",
      description: "Access mentorship, job opportunities, and career guidance from successful alumni.",
      icon: TrendingUp,
    },
    {
      title: "Global Network",
      description: "Connect with alumni worldwide across various industries and locations.",
      icon: Globe,
    },
    {
      title: "Give Back",
      description: "Support your alma mater through donations and knowledge sharing.",
      icon: Heart,
    },
    {
      title: "Stay Updated",
      description: "Never miss important events, reunions, and college updates.",
      icon: Calendar,
    },
  ]




  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-black" />
            </div>
            <span className="text-2xl font-bold text-black">
              AlumniConnect
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
              Features
            </a>
            <a href="#about" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
              About
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
              Stories
            </a>
            <a href="#contact" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
              Contact
            </a>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="hover:cursor-pointer">
                  Sign In
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader className="mb-4">
                  <DialogTitle>Welcome Back</DialogTitle>
                  <DialogDescription>Sign in to your AlumniConnect account</DialogDescription>
                </DialogHeader>
                {(
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">
                        Email
                      </Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        className="border-purple-200 focus:border-purple-500"
                        onChange={(e) => { setEmail(e.target.value) }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">
                        Password
                      </Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        className="border-purple-200 focus:border-purple-500"
                        ref={passwordRef}
                      />
                    </div>
                    <Button
                      className="w-full bg-black opacity-90"
                      onClick={(e) => { signInUser() }}
                    >
                      Sign In
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
                <Button>
                  Get Started
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Join AlumniConnect</DialogTitle>
                  <DialogDescription>Create your account and connect with the community</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="role-select" className="w-full">
                  <TabsContent value="role-select" className="space-y-4">
                    <div className="space-y-4">
                      <Label >I am a...</Label>
                      <div className="grid grid-cols-3 gap-2">
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
                        <Button
                          variant={selectedRole === "admin" ? "default" : "outline"}
                          className={`flex flex-col items-center p-4 h-auto ${selectedRole === "admin"
                            ? "bg-black"
                            : "border-purple-200 hover:bg-purple-50"
                            }`}
                          onClick={() => setSelectedRole("admin")}
                        >
                          <Shield className="h-6 w-6 mb-2" />
                          <span className="text-sm">Admin</span>
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
                                <Label htmlFor="major">
                                  Major
                                </Label>
                                <Input
                                  id="major"
                                  placeholder="Computer Science"
                                  className="border-purple-200 focus:border-purple-500"
                                  value={major}
                                  onChange={(e) => setMajor(e.target.value)}
                                />
                              </div>
                            </div>
                            {/* <div className="space-y-2">
                              <Label htmlFor="degree">
                                Degree
                              </Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select degree" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="btech">B.Tech</SelectItem>
                                  <SelectItem value="mtech">M.Tech</SelectItem>
                                  <SelectItem value="mba">MBA</SelectItem>
                                  <SelectItem value="phd">PhD</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div> */}
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
                                <Label htmlFor="major">
                                  Major
                                </Label>
                                <Input
                                  id="major"
                                  placeholder="Computer Science"
                                  className="border-purple-200 focus:border-purple-500"
                                  value={major}
                                  onChange={(e) => setMajor(e.target.value)}
                                />
                              </div>
                            </div>
                          </>
                        )}
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
                        <Button onClick={(e) => { e.preventdefaut; registerUser() }} className="w-full">Create Account</Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-purple-100 px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">
                Features
              </a>
              <a href="#about" className="text-gray-600 hover:text-purple-600 transition-colors">
                About
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-purple-600 transition-colors">
                Stories
              </a>
              <a href="#contact" className="text-gray-600 hover:text-purple-600 transition-colors">
                Contact
              </a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-purple-100">
                <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="">
                      Sign In
                    </Button>
                  </DialogTrigger>
                </Dialog>
                <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                  <DialogTrigger asChild>
                    <Button className="">Get Started</Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-purple-100 text-purple-700 border-purple-200">
            🎓 Connecting Alumni Worldwide
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Strengthen Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600">
              {" "}
              Alumni Network
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
            A comprehensive platform that enables alumni to register, connect, contribute, and engage with the college
            and fellow alumni. Build lasting relationships, advance careers, and give back to your alma mater.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="text-lg px-10 py-4 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600  shadow-lg"
                >
                  Join the Network
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </DialogTrigger>
            </Dialog>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-4 border-purple-200 text-purple-800 hover:bg-purple-50"
            >
              Explore Features
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white ">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <stat.icon className="h-8 w-8 text-purple-200" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-purple-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Join AlumniConnect?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the benefits of being part of our thriving alumni community
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gradient-to-br from-purple-50 to-violet-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Platform Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform offers all the tools you need to strengthen alumni relationships, support career growth, and
              foster community engagement.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-105"
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`mx-auto w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-lg text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Building Bridges Between Past, Present, and Future
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Our mission is to create a thriving ecosystem where alumni can contribute to their alma mater's growth
                while advancing their own careers and personal development through meaningful connections.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-gray-700">Secure and user-friendly platform</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-gray-700">Professional networking opportunities</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-gray-700">Transparent donation and contribution tracking</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-gray-700">Comprehensive event management</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-violet-600 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Platform Objectives</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Create a user-friendly and secure web platform for alumni engagement</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Strengthen the alumni network through professional growth opportunities</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Enhance philanthropic support with transparent donation processes</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Showcase alumni success stories to inspire the community</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Effectively organize and manage alumni events and reunions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-gradient-to-br from-purple-50 to-violet-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories from Our Community</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from alumni who have benefited from our platform and strengthened their professional networks.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-4 border-t pt-4">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-purple-600">{testimonial.year}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Connect with Your Alumni Network?</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90">
            Join thousands of alumni who are already benefiting from our comprehensive platform. Start building
            meaningful connections and advancing your career today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="text-lg px-10 py-4 bg-white text-purple-600 hover:bg-gray-100 shadow-lg">
                  Create Your Profile
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">AlumniConnect</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Connecting alumni worldwide and strengthening institutional bonds through technology and community
                engagement.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-purple-400" />
                  <span className="text-sm">contact@alumniconnect.edu</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-purple-400" />
                  <span className="text-sm">+91 91193XXXXX</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-purple-400" />
                  <span className="text-sm">Japur, Rajasthan, India</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 text-purple-300">Quick Links</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Success Stories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Events
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 text-purple-300">For Alumni</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Register
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Directory
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Job Portal
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Donate
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 text-purple-300">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AlumniConnect. All rights reserved. Built with ❤️ for our alumni community.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

// import { useState, useEffect } from "react";
// import { Link, NavLink } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Button } from "./ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
// import { Input } from "./ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
// import { Badge } from "./ui/badge";
// import {
//     MapPin,
//     CheckCircle,
//     Users,
//     Briefcase,
//     Search,
//     Calendar,
//     MessageSquare,
//     User,
//     LogOut,
//     Bell,
//     Home,
//     Settings,
//     Menu,
//     X,
//     Plus,
//     TrendingUp,
//     Activity,
//     Star,
//     ChevronRight,
//     Heart,
//     Network,
//     Building
// } from "lucide-react";
// import Header from "./Header";
// import Homepage from "./Homepage";

// function Dashboard() {
//     const navigate = useNavigate();
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState("home");
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//     const [recentJobs, setRecentJobs] = useState([]);
//     const [upcomingEvents, setUpcomingEvents] = useState([]);
//     const [notifications, setNotifications] = useState([]);

//     useEffect(() => {
//         // Fetch user data
//         // const fetchUserData = async () => {
//         //   try {
//         //     // This would be replaced with your actual API endpoint
//         //     const response = await axios.get("http://localhost:8000/gradlink/api/v1/users/current-user", {
//         //       withCredentials: true
//         //     });
//         //     setUser(response.data.data);
//         //     setLoading(false);
//         //   } catch (error) {
//         //     console.error("Failed to fetch user data:", error);
//         //     // Redirect to landing page if not authenticated
//         //     navigate("/");
//         //   }
//         // };

//         // Mock data for jobs, events, and notifications
//         // In a real app, these would be fetched from your API

//         // fetchUserData();
//     }, [navigate]);

//     const handleLogout = async () => {
//         try {
//             await axios.post("http://localhost:8000/gradlink/api/v1/users/logout");
//             navigate("/");
//         } catch (error) {
//             console.error("Logout failed:", error);
//         }
//     };

//     //   if (loading) {
//     //     return (
//     //       <div className="flex items-center justify-center min-h-screen">
//     //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//     //       </div>
//     //     );
//     //   }

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <Header/>
//             <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 {/* Home Tab */}
//                 <Homepage/>
//             </main>
//         </div>
//     );
// }

// export default Dashboard;

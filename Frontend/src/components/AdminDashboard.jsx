import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Users,
    Briefcase,
    DollarSign,
    Settings,
    Bell,
    LogOut,
    Search,
    PlusCircle,
    Edit,
    Trash,
    ChevronRight
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import Header from "./Header";
import FundraiserManagement from "./FundraiserManagement";

function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("fundraisers");
    const [stats, setStats] = useState({
        users: 0,
        jobs: 0,
        fundraisers: 0,
        events: 0
    });

    useEffect(() => {
        // In a real implementation, fetch admin dashboard stats
        const fetchAdminStats = async () => {
            try {
                // Mock data for demonstration
                setStats({
                    users: 1248,
                    jobs: 156,
                    fundraisers: 24,
                    events: 18
                });
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
            }
        };

        fetchAdminStats();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8000/gradlink/api/v1/users/logout");
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-indigo-600">GradLink Admin</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                                <Bell className="h-6 w-6" />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                            >
                                <LogOut className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <Users className="h-8 w-8 text-indigo-600 mr-2" />
                                <span className="text-2xl font-bold">{stats.users}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Jobs Posted</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <Briefcase className="h-8 w-8 text-indigo-600 mr-2" />
                                <span className="text-2xl font-bold">{stats.jobs}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Fundraisers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <DollarSign className="h-8 w-8 text-indigo-600 mr-2" />
                                <span className="text-2xl font-bold">{stats.fundraisers}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <Settings className="h-8 w-8 text-indigo-600 mr-2" />
                                <span className="text-2xl font-bold">{stats.events}</span>
                            </div>
                        </CardContent>
                    </Card> */}
                </div>
                <div className="mt-5">
                    <FundraiserManagement />
                </div>

            </div>
        </div>
    );
}

export default AdminDashboard;

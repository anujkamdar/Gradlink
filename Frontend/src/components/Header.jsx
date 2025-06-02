import React,{useState} from "react";
import { Link, NavLink } from "react-router-dom";
import { Bell, User, LogOut, Menu, X } from "lucide-react";




export default function Header() {
    const activeTab = 1;
    const user = null;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-indigo-600">GradLink</h1>
                        <nav className="hidden md:ml-10 md:flex md:space-x-8">
                            <NavLink
                                to="/tabs/home"
                                className={({ isActive }) => `${isActive ? "text-indigo-600 border-indigo-600" : "text-gray-500 border-transparent hover:text-gray-700"} border-b-2 px-1 py-2 text-sm font-medium`}
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/tabs/jobs"
                                className={({ isActive }) => `${isActive ? "text-indigo-600 border-indigo-600" : "text-gray-500 border-transparent hover:text-gray-700"} border-b-2 px-1 py-2 text-sm font-medium`}
                            >
                                Jobs
                            </NavLink>
                            <NavLink
                                to="/tabs/network"
                                className={({ isActive }) => `${isActive ? "text-indigo-600 border-indigo-600" : "text-gray-500 border-transparent hover:text-gray-700"} border-b-2 px-1 py-2 text-sm font-medium`}

                            >
                                Network
                            </NavLink>
                            <NavLink
                                to="/tabs/events"
                                className={({ isActive }) => `${isActive ? "text-indigo-600 border-indigo-600" : "text-gray-500 border-transparent hover:text-gray-700"} border-b-2 px-1 py-2 text-sm font-medium`}
                            >
                                Events
                            </NavLink>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="relative p-1 rounded-full text-gray-400 hover:text-gray-500">
                            <Bell className="h-6 w-6" />
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                        </button>
                        <div className="hidden md:flex items-center space-x-2">
                            <div
                                className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer"
                                onClick={() => navigate("/profile-page")}
                            >
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
                                ) : (
                                    <User className="h-5 w-5 text-gray-500" />
                                )}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                                {user?.fullname?.split(" ")[0] || "User"}
                            </span>
                        </div>
                        <button
                            // onClick={handleLogout}
                            className="hidden md:inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            <LogOut className="mr-1 h-4 w-4" />
                            Logout
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden">
                    <div className="pt-2 pb-4 space-y-1 px-4">
                        <button
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                            }}
                            className={`${activeTab === "home" ? "bg-indigo-50 text-indigo-600" : "text-gray-500"
                                } block px-3 py-2 rounded-md text-base font-medium w-full text-left`}
                        >
                            Home
                        </button>
                        <button
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                            }}
                            className={`${activeTab === "jobs" ? "bg-indigo-50 text-indigo-600" : "text-gray-500"
                                } block px-3 py-2 rounded-md text-base font-medium w-full text-left`}
                        >
                            Jobs
                        </button>
                        <button
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                            }}
                            className={`${activeTab === "network" ? "bg-indigo-50 text-indigo-600" : "text-gray-500"
                                } block px-3 py-2 rounded-md text-base font-medium w-full text-left`}
                        >
                            Network
                        </button>
                        <button
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                            }}
                            className={`${activeTab === "events" ? "bg-indigo-50 text-indigo-600" : "text-gray-500"
                                } block px-3 py-2 rounded-md text-base font-medium w-full text-left`}
                        >
                            Events
                        </button>
                        <button
                            onClick={() => {
                                navigate("/profile-page");
                                setIsMobileMenuOpen(false);
                            }}
                            className="text-gray-500 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                        >
                            Profile
                        </button>
                        <button
                            // onClick={handleLogout}
                            className="text-gray-500 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </header>
    )
}
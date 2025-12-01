import React, { use, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Users, Building, User, Briefcase, MapPin, Filter, ChevronLeft, ChevronRight, GraduationCap, Mail } from 'lucide-react';
import { Badge } from './ui/badge';
import Header from './Header';
import "../App.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Backend_url } from "../info.js";

export default function Network() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [waiting, setWaiting] = useState(true);
    const [search, setSearch] = useState("");
    const [graduationYear, setGraduationYear] = useState("");
    const [major, setMajor] = useState("");
    const [networkMembers, setNetworkMembers] = useState([]);
    const [majors, setMajors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const usersPerPage = 9;




    const fetchUsers = async (page = 1) => {
        try {
            console.log(search, major, graduationYear, page)
            const response = await axios.post(`${Backend_url}/gradlink/api/v1/users/get-users`, { 
                search, 
                major, 
                graduationYear, 
                page, 
                limit: usersPerPage 
            }, { withCredentials: true });
            
            setNetworkMembers(response.data.data.docs || response.data.data)
            setTotalPages(response.data.data.totalPages || Math.ceil((response.data.data.length || 0) / usersPerPage));
            setTotalUsers(response.data.data.totalDocs || response.data.data.length || 0);
            setCurrentPage(page);
            console.log(response.data.data);
            setLoading(false)
        } catch (error) {
            console.log(error.response?.data?.message || "Something went wrong")
            setLoading(false);
        }
    }

    const fetchMajors = async () => {
        try {
            const response = await axios.get(`${Backend_url}/gradlink/api/v1/users/get-majors`, { withCredentials: true });
            console.log(response.data.data);
            setMajors(response.data.data);
            setWaiting(false);
        } catch (error) {
            console.log(error.response?.data?.message || "Something went wrong")
            setWaiting(false);
        }
    }



    useEffect(() => {
        setCurrentPage(1);
        fetchUsers(1);
    }, [search, major, graduationYear])

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            fetchUsers(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        fetchMajors();
    }, [])








    if (loading || waiting) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
            </div>
        );
    }



    return (
        <>
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-8">
                        {/* Network Header */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Student & Alumni Network</h1>
                            <p className="text-gray-600 mt-2">
                                Connect with fellow students and alumni. Build your professional network and discover new opportunities.
                            </p>
                        </div>

                        {/* Filters and Search */}
                        <div>
                            <div className="flex items-center mb-4">
                                <Filter className="h-5 w-5 mr-2 text-gray-700" />
                                <h2 className="text-xl font-semibold text-gray-900">Discover Students & Alumni</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="col-span-1 md:col-span-1">
                                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or company" className="w-full" />
                                </div>
                                <div className="col-span-1 md:col-span-1">
                                    <select value={graduationYear} onChange={(e) => setGraduationYear(Number(e.target.value))} className="w-full h-10 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value="">All Years</option>
                                        {/* Generate options for the last 100 years */}
                                        {Array.from({ length: 100 }, (_, i) => 2030 - i).map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}

                                    </select>
                                </div>
                                <div className="col-span-1 md:col-span-1">
                                    <select value={major} onChange={(e) => setMajor(e.target.value)} className="w-full h-10 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value="">All Majors</option>
                                        {majors.map((major, index) => (
                                            <option key={index} value={major}>{major}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Network Members */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Network Members 
                                <span className="text-gray-500 text-sm font-normal">
                                    ({totalUsers} members found)
                                </span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {networkMembers.map(member => (
                                    <Card key={member._id} className="overflow-hidden bg-white hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-indigo-300 h-80 flex flex-col">
                                        <div className="p-6 flex flex-col h-full">
                                            {/* Header with Avatar and Name - Fixed Height */}
                                            <div className="flex items-start mb-4 min-h-[4rem]">
                                                <div 
                                                    className="h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500 mr-4 cursor-pointer hover:scale-105 transition-transform duration-200 flex-shrink-0" 
                                                    onClick={() => navigate(`/user-profile/${member._id}`)}
                                                >
                                                    {member.avatar ? (
                                                        <img src={member.avatar} className="h-full w-full object-cover" alt={member.fullname} />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center">
                                                            <User className="h-8 w-8 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-lg text-gray-900 truncate cursor-pointer hover:text-indigo-600 mb-1" onClick={() => navigate(`/user-profile/${member._id}`)}>
                                                        {member.fullname}
                                                    </h3>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <GraduationCap className="h-4 w-4 mr-1 flex-shrink-0" />
                                                        <span className="truncate">Class of {member.graduationYear || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Major - Fixed Height */}
                                            <div className="mb-4 min-h-[2rem] flex items-center">
                                                <Badge variant="outline" className="text-sm bg-gray-50">
                                                    {member.major || 'Major not specified'}
                                                </Badge>
                                            </div>

                                            {/* Professional Info - Always Present with Fixed Height */}
                                            <div className="mb-4 p-3 bg-blue-50 rounded-lg min-h-[4rem] flex flex-col justify-center">
                                                {member.position || member.company ? (
                                                    <>
                                                        <p className="font-medium text-gray-900 text-sm mb-1">
                                                            {member.position || 'Position not specified'}
                                                        </p>
                                                        <div className="flex items-center text-gray-600 text-sm">
                                                            <Briefcase className="h-4 w-4 mr-1 flex-shrink-0" />
                                                            <span className="truncate">
                                                                {member.company || 'Company not specified'}
                                                            </span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex items-center justify-center text-gray-500 text-sm">
                                                        <GraduationCap className="h-4 w-4 mr-2" />
                                                        <span>Student</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Skills - Fixed Height with Flex Grow */}
                                            <div className="flex-1 mb-4 min-h-[3rem]">
                                                <p className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">Skills</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {member.skills && member.skills.length > 0 ? (
                                                        <>
                                                            {member.skills.slice(0, 3).map((skill, index) => (
                                                                <Badge key={index} variant="secondary" className="text-xs bg-indigo-100 text-indigo-800">
                                                                    {skill}
                                                                </Badge>
                                                            ))}
                                                            {member.skills.length > 3 && (
                                                                <Badge variant="outline" className="text-xs text-gray-600">
                                                                    +{member.skills.length - 3} more
                                                                </Badge>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <Badge variant="outline" className="text-xs text-gray-500">
                                                            No skills listed
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Contact Action - Always at Bottom */}
                                            <div className="mt-auto pt-4 border-t border-gray-100">
                                                <Button 
                                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" 
                                                    onClick={() => navigate(`/user-profile/${member._id}`)}
                                                >
                                                    <User className="h-4 w-4 mr-2" />
                                                    View Profile
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center mt-8 space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="flex items-center"
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Previous
                                    </Button>

                                    <div className="flex items-center space-x-1">
                                        {/* Show page numbers */}
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNumber;
                                            if (totalPages <= 5) {
                                                pageNumber = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNumber = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNumber = totalPages - 4 + i;
                                            } else {
                                                pageNumber = currentPage - 2 + i;
                                            }

                                            return (
                                                <Button
                                                    key={pageNumber}
                                                    variant={currentPage === pageNumber ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handlePageChange(pageNumber)}
                                                    className="w-8 h-8 p-0"
                                                >
                                                    {pageNumber}
                                                </Button>
                                            );
                                        })}

                                        {totalPages > 5 && currentPage < totalPages - 2 && (
                                            <>
                                                <span className="px-2 text-gray-500">...</span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handlePageChange(totalPages)}
                                                    className="w-8 h-8 p-0"
                                                >
                                                    {totalPages}
                                                </Button>
                                            </>
                                        )}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="flex items-center"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
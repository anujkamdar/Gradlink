import React, { use, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Users, Building, User, Briefcase, MapPin, Filter } from 'lucide-react';
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




    const fetchUsers = async () => {
        try {
            console.log(search, major, graduationYear)
            const response = await axios.post(`${Backend_url}/gradlink/api/v1/users/get-users`, { search, major, graduationYear }, { withCredentials: true });
            setNetworkMembers(response.data.data.docs)
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
        fetchUsers();
    }, [search, major, graduationYear])

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
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Network Members <span className="text-gray-500 text-sm font-normal">({networkMembers.length} members found)</span></h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {networkMembers.map(member => (
                                    <Card key={member._id} className="overflow-hidden bg-white">
                                        <div className="p-5">
                                            <div className="flex items-start">
                                                <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 mr-4 cursor-pointer" onClick={() => navigate(`/user-profile/${member._id}`)}>
                                                    {member.avatar ? (
                                                        <img src={member.avatar} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <User className="h-full w-full p-3 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>

                                                    <h3 className="font-semibold text-lg">{member.fullname}</h3>
                                                    {member.position && (
                                                        <p className="text-gray-600 text-sm">{member.position}</p>
                                                    )}
                                                    {member.company && (
                                                        <div className="flex items-center text-gray-500 text-sm mt-1">
                                                            <Briefcase className="h-4 w-4 mr-1" />
                                                            <span>{member.company}</span>
                                                        </div>
                                                    )}

                                                    {/* <div className="flex items-center text-gray-500 text-sm mt-1">
                                                        <MapPin className="h-4 w-4 mr-1" />
                                                        <span>{member.location}</span>
                                                    </div> */}
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                                    <span className="mr-2">{member.major}</span>
                                                    <span className="mr-2">•</span>
                                                    <span>Class of {member.graduationYear}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {member.skills.slice(0, 3).map((skill, index) => (
                                                        <Badge key={index} variant="secondary" className="text-xs">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                    {member.skills.length > 3 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{member.skills.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <Button className="w-full mt-4" variant={"outline"}>
                                                {"Coming Soon"}
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
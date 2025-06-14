import React, { useEffect, useState } from 'react';
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

export default function Network() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [graduationYear, setGraduationYear] = useState("");
    const [major, setMajor] = useState("");
    const [company, setCompany] = useState("");
    const [networkMembers, setNetworkMembers] = useState([]);




    const fetchUsers = async () => {
        try {
            console.log(search, company, major, graduationYear)
            const response = await axios.post("http://localhost:8000/gradlink/api/v1/users/get-users", { search, major, company, graduationYear }, { withCredentials: true });
            setNetworkMembers(response.data.data)
            console.log(response.data.data);
        } catch (error) {
            console.log(error.response?.data?.message || "Something went wrong")
        }
    }


    useEffect(() => {
        fetchUsers();
    }, [search, major, company, graduationYear])








    // will later work on this section
    const networkStats = {
        totalMembers: 9,
        students: 2,
        alumni: 7,
        companies: 9
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="loader bg-indigo-600"></div>
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

                        {/* Network Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card className="bg-white">
                                <CardContent className="p-5 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Members</p>
                                        <p className="text-3xl font-bold">{networkStats.totalMembers}</p>
                                    </div>
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <Users className="h-6 w-6 text-blue-600" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white">
                                <CardContent className="p-5 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Students</p>
                                        <p className="text-3xl font-bold">{networkStats.students}</p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <User className="h-6 w-6 text-green-600" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white">
                                <CardContent className="p-5 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Alumni</p>
                                        <p className="text-3xl font-bold">{networkStats.alumni}</p>
                                    </div>
                                    <div className="bg-purple-100 p-3 rounded-full">
                                        <User className="h-6 w-6 text-purple-600" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white">
                                <CardContent className="p-5 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Companies</p>
                                        <p className="text-3xl font-bold">{networkStats.companies}</p>
                                    </div>
                                    <div className="bg-orange-100 p-3 rounded-full">
                                        <Building className="h-6 w-6 text-orange-600" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Filters and Search */}
                        <div>
                            <div className="flex items-center mb-4">
                                <Filter className="h-5 w-5 mr-2 text-gray-700" />
                                <h2 className="text-xl font-semibold text-gray-900">Discover Students & Alumni</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="col-span-1 md:col-span-1">
                                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name" className="w-full" />
                                </div>
                                <div className="col-span-1 md:col-span-1">
                                    <select value={graduationYear} onChange={(e) => setGraduationYear(Number(e.target.value))} className="w-full h-10 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value="">All Years</option>
                                        <option value="2024">2024</option>
                                        <option value="2023">2023</option>
                                        <option value="2022">2022</option>
                                        <option value="2021">2021</option>
                                        <option value="2020">2020</option>
                                    </select>
                                </div>
                                <div className="col-span-1 md:col-span-1">
                                    <select value={major} onChange={(e) => setMajor(e.target.value)} className="w-full h-10 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value="">All Majors</option>
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Business Administration">Business Administration</option>
                                        <option value="Design">Design</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Marketing">Marketing</option>
                                    </select>
                                </div>
                                <div value={company} onChange={(e) => setCompany(e.target.value)} className="col-span-1 md:col-span-1">
                                    <select className="w-full h-10 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value="">All Companies</option>
                                        <option value="Google">Google</option>
                                        <option value="Microsoft">Microsoft</option>
                                        <option value="Apple">Apple</option>
                                        <option value="Amazon">Amazon</option>
                                        <option value="Meta">Meta</option>
                                        <option value="Tesla">Tesla</option>
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
                                                <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 mr-4">
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
                                                {"Request Sent"}
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
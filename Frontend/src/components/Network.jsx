import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Users, Building, MessageSquare, User, Star } from 'lucide-react';
import Header from './Header';
import "../App.css";

export default function Network() {

    const [loading, setLoading] = React.useState(true);

    setTimeout(() => {
        setLoading(false)
    },2000)




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
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">My Network</h2>
                            <div className="mt-4 md:mt-0 flex space-x-3">
                                <Button variant="outline" className="flex items-center">
                                    <Users className="mr-1 h-4 w-4" />
                                    Find Alumni
                                </Button>
                                <Button className="flex items-center">
                                    <MessageSquare className="mr-1 h-4 w-4" />
                                    Messages
                                </Button>
                            </div>
                        </div>

                        {/* Connection Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-5 text-center">
                                    <Users className="h-6 w-6 mx-auto text-indigo-600 mb-2" />
                                    <h3 className="text-2xl font-bold">250</h3>
                                    <p className="text-sm text-gray-500">Connections</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-5 text-center">
                                    <Building className="h-6 w-6 mx-auto text-indigo-600 mb-2" />
                                    <h3 className="text-2xl font-bold">36</h3>
                                    <p className="text-sm text-gray-500">Companies</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-5 text-center">
                                    <MessageSquare className="h-6 w-6 mx-auto text-indigo-600 mb-2" />
                                    <h3 className="text-2xl font-bold">12</h3>
                                    <p className="text-sm text-gray-500">New Messages</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-5 text-center">
                                    <User className="h-6 w-6 mx-auto text-indigo-600 mb-2" />
                                    <h3 className="text-2xl font-bold">5</h3>
                                    <p className="text-sm text-gray-500">Pending Requests</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Alumni Directory */}
                        <Card>
                            <CardHeader className="px-6 pt-6 pb-0">
                                <CardTitle>Alumni Directory</CardTitle>
                                <CardDescription>Connect with alumni from your department or batch</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="mb-4">
                                    <Input placeholder="Search alumni by name, company, or location" />
                                </div>

                                <Tabs defaultValue="all">
                                    <TabsList className="mb-4">
                                        <TabsTrigger value="all">All Alumni</TabsTrigger>
                                        <TabsTrigger value="myBatch">My Batch</TabsTrigger>
                                        <TabsTrigger value="myDepartment">My Department</TabsTrigger>
                                        <TabsTrigger value="recommended">Recommended</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="all" className="space-y-4">
                                        {/* Mock alumni profiles */}
                                        {[
                                            {
                                                id: 1,
                                                name: "Priya Sharma",
                                                role: "Product Manager",
                                                company: "Google",
                                                batch: "2018",
                                                department: "Computer Science",
                                                location: "Bangalore",
                                                mutualConnections: 15
                                            },
                                            {
                                                id: 2,
                                                name: "Vikram Singh",
                                                role: "Software Engineer",
                                                company: "Microsoft",
                                                batch: "2019",
                                                department: "Computer Science",
                                                location: "Hyderabad",
                                                mutualConnections: 8
                                            },
                                            {
                                                id: 3,
                                                name: "Neha Patel",
                                                role: "Data Scientist",
                                                company: "Amazon",
                                                batch: "2017",
                                                department: "Computer Science",
                                                location: "Bangalore",
                                                mutualConnections: 5
                                            },
                                            {
                                                id: 4,
                                                name: "Rahul Verma",
                                                role: "UX Designer",
                                                company: "Flipkart",
                                                batch: "2018",
                                                department: "Design",
                                                location: "Mumbai",
                                                mutualConnections: 3
                                            }
                                        ].map((alumni) => (
                                            <Card key={alumni.id} className="hover:shadow-md transition-shadow">
                                                <CardContent className="p-5">
                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                                        <div className="flex items-center">
                                                            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                                <User className="h-6 w-6 text-gray-500" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <h4 className="font-medium text-gray-900">{alumni.name}</h4>
                                                                <p className="text-sm text-gray-500">
                                                                    {alumni.role} at {alumni.company}
                                                                </p>
                                                                <div className="mt-1 flex flex-wrap items-center text-xs text-gray-500">
                                                                    <span className="mr-2">Batch of {alumni.batch}</span>
                                                                    <span className="mr-2">•</span>
                                                                    <span className="mr-2">{alumni.department}</span>
                                                                    <span className="mr-2">•</span>
                                                                    <span>{alumni.location}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 md:mt-0 flex flex-col items-end">
                                                            <Button size="sm">Connect</Button>
                                                            <span className="text-xs text-gray-500 mt-1">
                                                                {alumni.mutualConnections} mutual connections
                                                            </span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}

                                        {/* Load More Button */}
                                        <div className="flex justify-center mt-6">
                                            <Button variant="outline" className="w-full md:w-auto">
                                                Load More
                                            </Button>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="myBatch" className="py-4">
                                        <div className="text-center py-8">
                                            <Users className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                                            <h3 className="text-lg font-medium">Filter by your batch</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Connect with classmates from your graduation year
                                            </p>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="myDepartment" className="py-4">
                                        <div className="text-center py-8">
                                            <Building className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                                            <h3 className="text-lg font-medium">Filter by your department</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Connect with alumni from your department
                                            </p>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="recommended" className="py-4">
                                        <div className="text-center py-8">
                                            <Star className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                                            <h3 className="text-lg font-medium">Recommended connections</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                People you might want to connect with based on your profile
                                            </p>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}


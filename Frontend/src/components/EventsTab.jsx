import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Users, Briefcase, Calendar, Plus } from "lucide-react";
import { MapPin, CheckCircle } from "lucide-react";
import Header from "./Header";

const upcomingEvents = [
    {
        id: 1,
        title: "Annual Alumni Meet",
        date: "July 15, 2025",
        location: "Campus Auditorium",
        attendees: 85
    },
    {
        id: 2,
        title: "Tech Webinar: AI Advancements",
        date: "June 20, 2025",
        location: "Virtual",
        attendees: 120
    },
    {
        id: 3,
        title: "Career Guidance Workshop",
        date: "June 10, 2025",
        location: "Campus Seminar Hall",
        attendees: 50
    }
]



export default function EventsTab() {
    return (
        <>
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Events</h2>
                            <div className="mt-4 md:mt-0 flex space-x-3">
                                <Button className="flex items-center">
                                    <Plus className="mr-1 h-4 w-4" />
                                    Create Event
                                </Button>
                            </div>
                        </div>


                        {/* Featured Event */}
                        <Card className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-none">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-2/3 md:pr-6">
                                        <Badge className="mb-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200">Featured Event</Badge>
                                        <h3 className="text-xl font-bold text-gray-900">Annual Alumni Meet 2025</h3>
                                        <p className="mt-2 text-gray-600">
                                            Join us for the most anticipated alumni gathering of the year. Connect with old friends,
                                            make new connections, and celebrate the achievements of our distinguished alumni.
                                        </p>
                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center text-sm">
                                                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                                <span>July 15, 2025 • 10:00 AM - 5:00 PM</span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                                <span>Main Campus Auditorium</span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <Users className="h-4 w-4 mr-2 text-gray-500" />
                                                <span>120+ attending</span>
                                            </div>
                                        </div>
                                        <div className="mt-6 flex space-x-3">
                                            <Button>Register Now</Button>
                                            <Button variant="outline">Add to Calendar</Button>
                                        </div>
                                    </div>
                                    <div className="mt-6 md:mt-0 md:w-1/3">
                                        <div className="bg-white rounded-lg p-4 shadow-sm">
                                            <h4 className="font-medium text-gray-900 mb-2">Event Highlights</h4>
                                            <ul className="space-y-2">
                                                <li className="flex items-start">
                                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                                                    <span className="text-sm text-gray-600">Keynote by Industry Leaders</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                                                    <span className="text-sm text-gray-600">Alumni Awards Ceremony</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                                                    <span className="text-sm text-gray-600">Networking Lunch</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                                                    <span className="text-sm text-gray-600">Campus Tour</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                                                    <span className="text-sm text-gray-600">Cultural Performances</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Upcoming Events */}
                        <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">Upcoming Events</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...upcomingEvents, ...upcomingEvents].slice(0, 6).map((event, index) => (
                                <Card key={`event-${event.id}-${index}`} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-0">
                                        <div className="bg-gray-100 h-40 flex items-center justify-center">
                                            <Calendar className="h-12 w-12 text-gray-400" />
                                        </div>
                                        <div className="p-5">
                                            <h4 className="font-medium text-gray-900">{event.title}</h4>
                                            <div className="mt-2 space-y-2">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    <span>{event.date}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <MapPin className="h-4 w-4 mr-2" />
                                                    <span>{event.location}</span>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex justify-between items-center">
                                                <span className="text-xs text-gray-500">{event.attendees} attending</span>
                                                <Button size="sm">RSVP</Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Load More Button */}
                        <div className="flex justify-center mt-6">
                            <Button variant="outline" className="w-full md:w-auto">
                                View All Events
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
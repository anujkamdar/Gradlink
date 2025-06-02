import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import Header from './Header';


const recentJobs = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Tech Solutions Inc.",
    location: "Remote",
    type: "Full-time",
    postedDate: "2 days ago",
    postedBy: "John Doe"
  },
  {
    id: 2,
    title: "Data Analyst",
    company: "Data Insights Ltd.",
    location: "Bangalore",
    type: "Part-time",
    postedDate: "1 week ago",
    postedBy: "Jane Smith"
  },
  {
    id: 3,
    title: "Product Manager",
    company: "Innovatech Corp.",
    location: "Delhi",
    type: "Contract",
    postedDate: "3 days ago",
    postedBy: "Alice Johnson"
  },
  {
    id: 4,
    title: "UX Designer",
    company: "Creative Minds Studio",
    location: "Mumbai",
    type: "Internship",
    postedDate: "5 days ago",
    postedBy: "Bob Brown"
  }
];












export default function JobsPage() {
  return (
    <>
      <div className="bg-gray-50 min-h-screen">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Job Opportunities</h2>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Button variant="outline" className="flex items-center">
                  <Plus className="mr-1 h-4 w-4" />
                  Post a Job
                </Button>
                <Button className="flex items-center">
                  <Search className="mr-1 h-4 w-4" />
                  Find Jobs
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Input placeholder="Search jobs by title, company or keyword" />
                  </div>
                  <div>
                    <select className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="">All Locations</option>
                      <option value="remote">Remote</option>
                      <option value="delhi">Delhi</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="bangalore">Bangalore</option>
                    </select>
                  </div>
                  <div>
                    <select className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="">All Job Types</option>
                      <option value="fulltime">Full-time</option>
                      <option value="parttime">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Listings */}
            <div className="space-y-4">
              {/* Featured Jobs Section */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Featured Opportunities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentJobs.slice(0, 2).map((job) => (
                    <Card key={job.id} className="border-l-4 border-l-indigo-600">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{job.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {job.company} • {job.location}
                            </p>
                            <div className="mt-2 flex items-center">
                              <Badge variant="outline" className="mr-2 bg-blue-50 text-blue-700 border-blue-200">
                                {job.type}
                              </Badge>
                              <span className="text-xs text-gray-500">Posted {job.postedDate}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Posted by: {job.postedBy}</p>
                          </div>
                          <Button size="sm">Apply</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* All Jobs */}
              <h3 className="text-lg font-medium text-gray-900 mb-4">All Opportunities</h3>
              {[...recentJobs, ...recentJobs].slice(0, 6).map((job, index) => (
                <Card key={`all-${job.id}-${index}`}>
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{job.title}</h4>
                        <p className="text-sm text-gray-500">
                          {job.company} • {job.location}
                        </p>
                        <div className="mt-1 flex items-center">
                          <Badge variant="outline" className="mr-2 bg-blue-50 text-blue-700 border-blue-200">
                            {job.type}
                          </Badge>
                          <span className="text-xs text-gray-500">Posted {job.postedDate}</span>
                        </div>
                      </div>
                      <div className="mt-3 md:mt-0 flex space-x-2">
                        <Button variant="outline" size="sm">
                          Save
                        </Button>
                        <Button size="sm">Apply Now</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Load More Button */}
              <div className="flex justify-center mt-6">
                <Button variant="outline" className="w-full md:w-auto">
                  Load More Jobs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
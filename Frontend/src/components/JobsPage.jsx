import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  BookmarkIcon,
  Briefcase,
  MapPin,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Plus,
  Building,
  Calendar,
  CheckCircle2,
  Eye,
  FileText,
  Share2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Backend_url } from '@/info';

export default function JobsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);

  // Handle pagination
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  const getJobPostings = async () => {
    try {
      const response = await axios.post(
        `${Backend_url}/gradlink/api/v1/users/get-job-postings`,
        { search, location, type, currentPage },
        { withCredentials: true }
      );
      setTotalPages(response.data.data.pages);
      setJobs(response.data.data.jobs);
    } catch (error) {
      console.log(error.response?.data?.message || "Network Error");
    }
  }

  const getCurrentUser = async () => {
    try {
      const response = await axios.get(`${Backend_url}/gradlink/api/v1/users/current-user-profile`, { withCredentials: true });
      setUser(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error.response?.data?.message || "Error fetching user data");
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    getJobPostings();
  }, [currentPage, search, location, type]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, location, type]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Job Opportunities</h2>
              <div className="mt-4 md:mt-0 flex space-x-3">
                {user?.role === 'alumni' && (
                  <Button
                    variant="outline"
                    className="flex items-center"
                    onClick={() => navigate('/tabs/my-jobs')}
                  >
                    <Briefcase className="mr-1 h-4 w-4" />
                    My Posted Jobs
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="flex items-center"
                  onClick={() => navigate('/tabs/my-applications')}
                >
                  <BookmarkIcon className="mr-1 h-4 w-4" />
                  My Applications
                </Button>

                {user.role === "alumni" && (
                  <Button
                    variant="outline"
                    className="flex items-center"
                    onClick={() => navigate('/tabs/post-job')}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Post a Job
                  </Button>
                )}
                <Button onClick={() => { getJobPostings() }} className="flex items-center">
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
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search jobs by title, company or keyword"
                    />
                  </div>
                  <div>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target?.value)}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">All Locations</option>
                      <option value="remote">Remote</option>
                      <option value="delhi">Delhi</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="bangalore">Bangalore</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">All Job Types</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Listings */}
            <div className="space-y-4">
              {/* Section title */}
              <h3 className="text-lg font-medium text-gray-900 mb-4">Available Opportunities</h3>

              {/* Loading state */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading job listings...</p>
                </div>
              ) : jobs.length === 0 ? (
                <Card>
                  <CardContent className="p-10 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Briefcase className="h-12 w-12 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Jobs Found</h3>
                      <p className="mb-4">We couldn't find any jobs matching your criteria. Try adjusting your filters.</p>
                      <Button onClick={() => {
                        setSearch("");
                        setLocation("");
                        setType("");
                      }} className="flex items-center">
                        <Search className="mr-1 h-4 w-4" />
                        Clear Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                jobs.map((job) => (
                  <Card
                    key={job._id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-indigo-500"
                  >
                    <CardContent className="p-0">
                      <div className="p-6">
                        {/* Header Section with Company and Actions */}
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                          {/* Left - Company Info */}
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="bg-indigo-100 text-indigo-700 rounded-lg p-3 w-12 h-12 flex items-center justify-center">
                                <Building className="h-6 w-6" />
                              </div>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
                                {job.title}
                              </h3>
                              <p className="text-gray-600 flex items-center mt-1">
                                <Briefcase className="h-4 w-4 mr-1.5 text-indigo-500" />
                                {job.company}
                              </p>
                            </div>
                          </div>

                          {/* Right - Action Buttons */}
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/tabs/jobs/${job._id}`);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1.5" />
                              View Details
                            </Button>

                            {!job.isAlreadyApplied ? (
                              <Button
                                size="sm"
                                className="bg-indigo-600 hover:bg-indigo-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/tabs/jobs/${job._id}`);
                                }}
                              >
                                Apply Now
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
                                onClick={(e) => e.stopPropagation()}
                                disabled
                              >
                                Already Applied
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Status Indicators */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-full mr-3">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Posted By</p>
                              <p className="text-lg font-bold text-gray-900">{job.postedByDetails[0].fullname}</p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-full mr-3">
                              <Calendar className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Posted On</p>
                              <p className="text-lg font-bold text-gray-900">{formatDate(job.createdAt)}</p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-full mr-3">
                              <MapPin className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Location</p>
                              <p className="text-lg font-bold text-gray-900">{job.location}</p>
                            </div>
                          </div>
                        </div>

                        {/* Job Description */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <FileText className="h-4 w-4 mr-1.5 text-gray-500" />
                            Description
                          </h4>
                          <p className="text-gray-600 text-sm line-clamp-2 pl-6">{job.description}</p>
                        </div>

                        {/* Required Skills Section */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-1.5 text-gray-500" />
                            Required Skills
                          </h4>
                          <div className="pl-6 flex flex-wrap gap-1.5">
                            {/* Map through required skills and display badges on basis if that skill present in user or not*/}
                            {job.requiredSkills.map((skill, index) => (
                              <Badge
                                key={index}
                                className={`px-3 py-1 ${user?.skills?.includes(skill) ? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200' : 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100'}`}
                              >
                                {skill}
                              </Badge>
                            ))}


                          </div>
                        </div>
                      </div>

                      {/* Card Footer - Job Type & Quick Actions */}
                      <CardFooter className="bg-gray-50 border-t border-gray-100 px-6 py-3 flex justify-between items-center">
                        <Badge className={`px-3 py-1 text-[12px] ${job.type == 'full-time' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-lg shadow-emerald-500/25 px-4 py-2 transition-all duration-200' :
                          job.type === 'part-time' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 shadow-lg shadow-blue-500/25 px-4 py-2 transition-all duration-200' :
                            'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25 px-4 py-2 transition-all duration-200'
                          }`}>
                          <span className={`w-2 h-2 rounded-full mr-2 animate-pulse ${job.type == 'full-time' ? "bg-emerald-200" : job.type == "part-time" ? "bg-blue-200" : "bg-purple-200"}`}></span>
                          {job.type}
                        </Badge>


                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:text-indigo-600"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </CardContent>
                  </Card>
                ))
              )}

              {/* Pagination Controls */}
              {!loading && jobs.length > 0 && (
                <div className="flex justify-center mt-6">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {[...Array(totalPages).keys()].map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(page + 1)}
                      >
                        {page + 1}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, BookmarkIcon, Briefcase, MapPin, Clock, User, ChevronLeft, ChevronRight } from "lucide-react";
import Header from './Header';
import { useNavigate } from "react-router-dom";
import axios from 'axios';





export default function JobsPage() {
  const navigate = useNavigate();
  const [loading,setLoading] = useState(true);
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
      // console.log(search, location, type, currentPage);
      const response = await axios.post("http://localhost:8000/gradlink/api/v1/users/get-job-postings", { search, location, type, currentPage }, { withCredentials: true })
      console.log(response.data.data);
      setTotalPages(response.data.data.pages);
      setJobs(response.data.data.jobs);
    } catch (error) {
      console.log(error.response?.data?.message || "Network Error");
    }
  }

  const getCurrentUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/gradlink/api/v1/users/current-user-profile", { withCredentials: true });
      setUser(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error.response?.data?.message || "Error fetching user data");
    }
  };


  useEffect(() => {
    getCurrentUser();
  },[])
  useEffect(() => {
    getJobPostings();
  }, [currentPage, search, location, type]);
  useEffect(() => {
    setCurrentPage(1);
  }, [search, location, type]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
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
          <div className="space-y-6">            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Job Opportunities</h2>
            <div className="mt-4 md:mt-0 flex space-x-3">              {user?.role === 'alumni' && (
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
              
              {user.role == "alumini" &&<Button
                variant="outline"
                className="flex items-center"
                onClick={() => navigate('/tabs/post-job')}
              >
                <Plus className="mr-1 h-4 w-4" />
                Post a Job
              </Button>}
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
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search jobs by title, company or keyword" />
                  </div>
                  <div>
                    <select value={location} onChange={(e) => setLocation(e.target?.value)} className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="">All Locations</option>
                      <option value="remote">Remote</option>
                      <option value="delhi">Delhi</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="bangalore">Bangalore</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <select value={type} onChange={(e) => setType(e.target.value)} className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="">All Job Types</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>


            {!jobs && <h1>No jobs for this criteria</h1>}



            {/* Job Listings */}
            <div className="space-y-4">
              {/* Featured Jobs Section */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Featured Opportunities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobs && jobs.slice(0, 2).map((job) => (<Card key={job._id}
                    className="border-l-4 border-l-indigo-600 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    onClick={() => navigate(`/tabs/jobs/${job._id}`)}
                  >
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900 text-lg">{job.title}</h4>
                          <p className="text-sm text-gray-500 mt-1 flex items-center">
                            <Briefcase className="w-4 h-4 mr-1" />
                            {job.company}
                          </p>
                          <p className="text-sm text-gray-500 mt-1 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location}
                          </p>
                          <div className="mt-2 flex items-center">
                            <Badge variant="outline" className="mr-2 bg-blue-50 text-blue-700 border-blue-200">
                              {job.type}
                            </Badge>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              Posted {formatDate(job.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2 flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            Posted by: {job.postedByDetails[0].fullname}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className={`${job.isAlreadyApplied ? "bg-gradient-to-r from-green-500 to-green-900 text-white hover:bg-gradient-to-l" : "bg-indigo-600 hover:bg-indigo-700 text-white"
                            }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/tabs/jobs/${job._id}`);
                          }}
                        >
                          {job.isAlreadyApplied ? "Already Applied" : "Apply Now"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  ))}
                </div>
              </div>

              {/* All Jobs */}
              <h3 className="text-lg font-medium text-gray-900 mb-4">All Opportunities</h3>
              <div className="grid grid-cols-1 gap-4">
                {jobs && jobs.map((job, index) => {
                  return (
                    <Card key={job._id}
                      className="hover:shadow-md transition-shadow duration-300 overflow-hidden"
                      onClick={() => { navigate(`/tabs/jobs/${job._id}`) }}
                    >
                      <CardContent className="p-0">
                        <div className="p-5 border-l-4 border-l-transparent hover:border-l-indigo-600 transition-colors duration-300">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex items-start space-x-4">
                              <div className="flex-shrink-0 bg-gray-100 rounded-md p-3 hidden md:block">
                                <Briefcase className="w-8 h-8 text-indigo-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 text-lg">{job.title}</h4>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <span className="text-sm text-gray-600 flex items-center">
                                    <Briefcase className="w-4 h-4 mr-1 text-gray-400" />
                                    {job.company}
                                  </span>
                                  <span className="text-sm text-gray-600 flex items-center">
                                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                    {job.location}
                                  </span>
                                  <span className="text-sm text-gray-600 flex items-center">
                                    <Clock className="w-4 h-4 mr-1 text-gray-400" />
                                    {formatDate(job.createdAt)}
                                  </span>
                                </div>
                                <div className="mt-2 flex items-center">
                                  <Badge variant="outline" className="mr-2 bg-blue-50 text-blue-700 border-blue-200">
                                    {job.type}
                                  </Badge>
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <User className="w-3 h-3 mr-1" />
                                    {job.postedByDetails[0].fullname}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 md:mt-0 flex space-x-2">
                              {/* <Button variant="outline" size="sm" className="flex items-center">
                              <BookmarkIcon className="mr-1 h-4 w-4" />
                              Save
                            </Button> */}
                              {!job.isAlreadyApplied && (
                                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer">Apply Now</Button>
                              )}
                              {
                                job.isAlreadyApplied && (
                                  // give a good looking button with text "Already Applied"
                                  // use gradient background
                                  // greenish pinkish color
                                  <Button size="sm" className="bg-gradient-to-r from-green-500 to-green-900 text-white hover:bg-gradient-to-l">
                                    Already Applied
                                  </Button>





                                )
                              }
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center mt-8 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="ml-1">Previous</span>
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <Button
                      key={number}
                      variant={currentPage === number ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(number)}
                      className={`w-8 h-8 p-0 ${currentPage === number ? 'bg-indigo-600' : ''}`}
                    >
                      {number}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center"
                >
                  <span className="mr-1">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
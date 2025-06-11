import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Edit, 
  Trash, 
  FileText, 
  Users, 
  Clock, 
  MapPin, 
  Briefcase, 
  ChevronLeft, 
  ChevronRight,
  Building,
  Calendar,
  CheckCircle2,
  Eye,
  Star,
  CircleCheck,
  BarChart4,
  MessageCircle,
  Share2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function MyJobsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [myJobs, setMyJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  // Handle pagination
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const getMyJobPostings = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/gradlink/api/v1/users/my-job-postings?page=${currentPage}&search=${search}`, 
        { withCredentials: true }
      );
      
      setTotalPages(response.data.data.pages);
      setMyJobs(response.data.data.jobs);
    } catch (error) {
      console.log(error.response?.data?.message || "Network Error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMyJobPostings();
  }, [currentPage, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const confirmDeleteJob = (jobId) => {
    setJobToDelete(jobId);
    setShowDeleteDialog(true);
  };
  const deleteJob = async () => {
    try {
      await axios.post(`http://localhost:8000/gradlink/api/v1/users/delete-job`,{jobId : jobToDelete},{withCredentials:true }
      );
      
      getMyJobPostings();
      setShowDeleteDialog(false);
      setJobToDelete(null);
    } catch (error) {
      console.log(error.response?.data?.message || "Error deleting job");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Posted Jobs</h2>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Button
                  variant="outline"
                  className="flex items-center"
                  onClick={() => navigate('/tabs/post-job')}
                >
                  <Edit className="mr-1 h-4 w-4" />
                  Post New Job
                </Button>
                <Button onClick={() => { getMyJobPostings() }} className="flex items-center">
                  <Search className="mr-1 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Search */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div className="md:col-span-1">
                    <Input 
                      value={search} 
                      onChange={(e) => setSearch(e.target.value)} 
                      placeholder="Search your posted jobs by title or keyword" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Listings */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading your job postings...</p>
                </div>
              ) : myJobs.length === 0 ? (
                <Card>
                  <CardContent className="p-10 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Briefcase className="h-12 w-12 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Jobs Posted Yet</h3>
                      <p className="mb-4">You haven't posted any jobs yet. Start by posting your first job opening.</p>
                      <Button onClick={() => navigate('/tabs/post-job')} className="flex items-center">
                        <Edit className="mr-1 h-4 w-4" />
                        Post a Job
                      </Button>
                    </div>
                  </CardContent>
                </Card>              ) : (
                myJobs.map((job) => (
                  <Card key={job._id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-indigo-500">
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
                              <h3 className="text-xl font-bold text-gray-900 hover:text-indigo-600 cursor-pointer transition-colors" 
                                  onClick={() => navigate(`/tabs/jobs/${job._id}`)}>
                                {job.title}
                              </h3>
                              <p className="text-gray-600 flex items-center mt-1">
                                <Briefcase className="h-4 w-4 mr-1.5 text-indigo-500" />
                                {job.company}
                              </p>
                            </div>
                          </div>
                            {/* Right - Action Buttons */}
                          <div className="flex space-x-2">                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
                              onClick={() => navigate(`/tabs/jobs/${job._id}`)}
                            >
                              <Eye className="h-4 w-4 mr-1.5" />
                              View Details
                            </Button>
                            {job.applicants?.length > 0 && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700"
                                onClick={() => navigate(`/tabs/applications/${job._id}`)}
                              >
                                <Users className="h-4 w-4 mr-1.5" />
                                View Applications
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-red-200 bg-red-50 hover:bg-red-100 text-red-600" 
                              onClick={() => confirmDeleteJob(job._id)}
                            >
                              <Trash className="h-4 w-4 mr-1.5" />
                              Delete
                            </Button>
                          </div>
                        </div>
                        
                        {/* Status Indicators */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-full mr-3">
                              <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Applications</p>
                              <p className="text-lg font-bold text-gray-900">{job.applicants?.length || 0}</p>
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
                            {job.requiredSkills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Card Footer - Job Type & Quick Actions */}
                      <CardFooter className="bg-gray-50 border-t border-gray-100 px-6 py-3 flex justify-between items-center">
                        <Badge className={`px-3 py-1 ${
                          job.type === 'full-time' ? 'bg-blue-100 text-blue-800' : 
                          job.type === 'part-time' ? 'bg-purple-100 text-purple-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {job.type}
                        </Badge>
                        
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-indigo-600">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          {/* <Button variant="ghost" size="sm" className="text-gray-600 hover:text-indigo-600">
                            <BarChart4 className="h-4 w-4" />
                          </Button> */}
                        </div>
                      </CardFooter>
                    </CardContent>
                  </Card>
                ))
              )}

              {/* Pagination Controls */}
              {!isLoading && myJobs.length > 0 && (
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this job posting? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteJob}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  ArrowLeft,
  FileText,
  Download,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  X,
  Check,
  ExternalLink,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Award
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { Backend_url } from '@/info';

export default function JobApplicationsPage() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewCoverLetterDialog, setViewCoverLetterDialog] = useState(false);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  useEffect(() => {
    const fetchJobAndApplications = async () => {
      try {
        setLoading(true);
        const jobResponse = await axios.get(
          `${Backend_url}/gradlink/api/v1/users/job/${jobId}`,
          { withCredentials: true }
        );

        setJob(jobResponse.data.data);

        const applicationsResponse = await axios.get(
          `${Backend_url}/gradlink/api/v1/users/get-job-applications/${jobId}`,
          { withCredentials: true }
        );

        setApplications(applicationsResponse.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching job applications:", err);
        setError(err.response?.data?.message || "Failed to load applications");
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobAndApplications();
    }
  }, [jobId,]);

  const handleViewCoverLetter = (coverLetter, applicant) => {
    setSelectedCoverLetter(coverLetter);
    setSelectedApplicant(applicant);
    setViewCoverLetterDialog(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      console.log("hello");
      const response = await axios.post(`${Backend_url}/gradlink/api/v1/users/update-application-status`, {
        applicationId: applicationId,
        status: newStatus
      }, { withCredentials: true })

      const updatedApplications = applications.map((application) => {
        if (application._id == applicationId) {
          return { ...application, status: newStatus };
        } else {
          return application;
        }
      })
      setApplications(updatedApplications);
      console.log(response.data.message);
    } catch (error) {
      console.log(error.response?.data?.message || "Something went wrong")
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
          <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Applications</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/tabs/my-jobs')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Jobs
          </Button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
          <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => navigate('/tabs/my-jobs')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate('/tabs/my-jobs')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Jobs
          </Button>

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <div className="flex items-center text-gray-600 mb-1">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Posted on {formatDate(job.createdAt)}</span>
                </div>
              </div>

              <div className="mt-4 md:mt-0">
                <div className="flex items-center mb-2">
                  <span className="text-lg font-semibold text-indigo-600 mr-2">
                    {applications.length}
                  </span>
                  <span className="text-gray-600">Total Applications</span>
                </div>
                <Badge className={`
                  px-3 py-1 
                  ${job.type === 'full-time'
                    ? 'bg-blue-100 text-blue-800'
                    : job.type === 'part-time'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {job.type}
                </Badge>
              </div>
            </div>
          </div>
        </div>


        {/*Furute me jo karna h I Will add pagination and sorting by matchedSkills later*/}
        {/* Applications Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Applications</h2>

          {applications.length === 0 ? (
            <Card className="bg-white rounded-xl shadow-md">
              <CardContent className="p-10 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Applications Yet</h3>
                <p className="text-gray-600">
                  Your job posting hasn't received any applications yet. Check back later or share your job posting to attract more candidates.
                </p>
              </CardContent>
            </Card>
          ) : (
            applications.map((application) => {
              const matchedSkills = application.matchedSkills;
              const skillMatchPercentage = job.requiredSkills.length > 0
                ? Math.round((matchedSkills.length / job.requiredSkills.length) * 100)
                : 0;
              return (
                <Card
                  key={application._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4"
                  style={{
                    borderLeftColor: application.status === 'accepted'
                      ? '#10b981'
                      : application.status === 'rejected'
                        ? '#ef4444'
                        : '#6366f1'
                  }}
                >
                  <CardContent className="p-0">
                    <div className="p-6">
                      {/* Applicant Header */}
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                        <div className="flex items-start space-x-4">
                          <div className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                            <img
                              src={application.appliedByDetails?.avatar || 'https://via.placeholder.com/150'}
                              alt={application.appliedByDetails?.fullname}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{application.appliedByDetails?.fullname}</h3>
                            <p className="text-gray-600">{application.appliedByDetails?.email}</p>
                            <div className="flex items-center mt-1">
                              <GraduationCap className="h-4 w-4 text-indigo-500 mr-1" />
                              <span className="text-sm text-gray-600">
                                {application.appliedByDetails?.major}, Class of {application.appliedByDetails?.graduationYear}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 md:mt-0 flex flex-col items-end">
                          <Badge className={`mb-2 px-3 py-1 ${application.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : application.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                            }`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Applied on {formatDate(application.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Skills Match Section */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
                          <h4 className="text-sm font-semibold text-gray-700 flex items-center mb-2 sm:mb-0">
                            <CheckCircle2 className="h-4 w-4 mr-1.5 text-indigo-500" />
                            Skills Match
                          </h4>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                              <div
                                className={`h-2.5 rounded-full ${skillMatchPercentage >= 70
                                  ? 'bg-green-600'
                                  : skillMatchPercentage >= 40
                                    ? 'bg-yellow-400'
                                    : 'bg-red-500'
                                  }`}
                                style={{ width: `${skillMatchPercentage}%` }}
                              ></div>
                            </div>
                            <span className={`text-sm font-medium ${skillMatchPercentage >= 70
                              ? 'text-green-600'
                              : skillMatchPercentage >= 40
                                ? 'text-yellow-600'
                                : 'text-red-600'
                              }`}>
                              {skillMatchPercentage}%
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {job.requiredSkills.map((skill) => {
                            const isMatched = matchedSkills.includes(skill);
                            return (
                              <Badge
                                key={skill}
                                className={isMatched
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-gray-100 text-gray-500 border-gray-200"
                                }
                              >
                                {isMatched && <Check className="h-3 w-3 mr-1" />}
                                {skill}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>

                      {/* Actions Section */}
                      <div className="flex flex-wrap gap-3">
                        <Button
                          variant="outline"
                          className="border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
                          onClick={() => handleViewCoverLetter(application.coverLetter, application.appliedByDetails)}
                        >
                          <FileText className="h-4 w-4 mr-1.5" />
                          View Cover Letter
                        </Button>

                        <Button
                          variant="outline"
                          className="border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700"
                          onClick={() => window.open(application.resumeUrl, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-1.5" />
                          Download Resume
                        </Button>


                        <>
                          <Button
                            variant="outline"
                            className="border-green-200 bg-green-50 hover:bg-green-100 text-green-700"
                            onClick={() => updateApplicationStatus(application._id, 'accepted')}
                          >
                            <Check className="h-4 w-4 mr-1.5" />
                            Accept Application
                          </Button>

                          <Button
                            variant="outline"
                            className="border-red-200 bg-red-50 hover:bg-red-100 text-red-700"
                            onClick={() => updateApplicationStatus(application._id, 'rejected')}
                          >
                            <X className="h-4 w-4 mr-1.5" />
                            Reject Application
                          </Button>

                          <Button
                            variant="outline"
                            className="border-purple-200 bg-purple-50 hover:bg-purple-200 text-purple-700"
                            onClick={() => updateApplicationStatus(application._id, 'pending')}
                          >
                            <Clock className='h-4 w-4 mr-1.5 mt-0.5' />
                            Set to pending
                          </Button>
                        </>

                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Cover Letter Dialog */}
      <Dialog open={viewCoverLetterDialog} onOpenChange={setViewCoverLetterDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Cover Letter from {selectedApplicant?.fullname}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 bg-gray-50 p-6 rounded-lg border border-gray-200 max-h-[70vh] overflow-y-auto">
            {selectedCoverLetter ? (
              <div className="prose prose-indigo max-w-none">
                <p className="whitespace-pre-wrap">{selectedCoverLetter}</p>
              </div>
            ) : (
              <p className="text-gray-500 italic">No cover letter provided</p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setViewCoverLetterDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

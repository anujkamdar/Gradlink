import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import {
  FileText,
  Download,
  Calendar,
  Clock,
  ExternalLink,
  Mail,
  Phone,
  Briefcase,
  Building,
  MapPin,
  MoreVertical,
  Eye,
  CheckCircle2,
  XCircle,
  CircleDashed
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function MyJobApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewCoverLetterDialog, setViewCoverLetterDialog] = useState(false);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchUserApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8000/gradlink/api/v1/users/my-applications",
          { withCredentials: true }
        );

        setApplications(response.data.data);
        setLoading(false);
        console.log(response.data.data)
      } catch (err) {
        console.log("Error fetching job applications:", err);
        alert(err.response?.data?.message || "Failed to load your applications");
        setLoading(false);
      }
    };

    fetchUserApplications();
  }, []);

  const handleViewCoverLetter = (coverLetter, job) => {
    setSelectedCoverLetter(coverLetter);
    setSelectedJob(job);
    setViewCoverLetterDialog(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600"><CircleDashed className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'accepted':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" /> Accepted</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>;
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
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="p-6 rounded-lg shadow-sm bg-white">
          <div className="flex flex-col items-center">
            <XCircle className="h-12 w-12 text-red-500" />
            <p className="mt-4 text-lg font-medium text-gray-700">{error}</p>
            <Button 
              className="mt-4" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold text-gray-900">My Job Applications</h2>
            <div className="mt-4 md:mt-0">
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={() => navigate('/tabs/jobs')}
              >
                <Briefcase className="mr-1 h-4 w-4" />
                Browse Jobs
              </Button>
            </div>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No applications yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't applied to any jobs yet. Browse available opportunities and start applying!
              </p>
              <div className="mt-6">
                <Button 
                  onClick={() => navigate('/tabs/jobs')}
                  className="inline-flex items-center"
                >
                  <Briefcase className="mr-1 h-4 w-4" />
                  Find Jobs
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {applications.map((application) => (
                <Card key={application._id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="bg-gray-50 border-b p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg font-medium truncate">
                          {application.jobDetails.title}
                        </CardTitle>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Building className="h-4 w-4 mr-1" />
                          {application.jobDetails.company}
                        </div>
                      </div>
                      <div>
                        {getStatusBadge(application.status)}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                        <span className="text-sm text-gray-700">
                          {application.jobDetails.location}
                        </span>
                      </div>
                      
                      <div className="flex items-start">
                        <Briefcase className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                        <span className="text-sm text-gray-700">
                          {application.jobDetails.type}
                        </span>
                      </div>
                      
                      <div className="flex items-start">
                        <Calendar className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                        <span className="text-sm text-gray-700">
                          Applied on {formatDate(application.createdAt)}
                        </span>
                      </div>


                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Button 
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                          onClick={() => navigate(`/tabs/jobs/${application.jobDetails._id}`)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View Job
                        </Button>
                        
                        {application.coverLetter && (
                          <Button 
                            variant="outline"
                            size="sm"
                            className="flex items-center"
                            onClick={() => handleViewCoverLetter(application.coverLetter, application.jobDetails)}
                          >
                            <FileText className="h-3.5 w-3.5 mr-1" />
                            Cover Letter
                          </Button>
                        )}
                        
                        {application.resumeUrl && (
                          <Button 
                            variant="outline"
                            size="sm"
                            className="flex items-center"
                            onClick={() => window.open(application.resumeUrl, '_blank')}
                          >
                            <Download className="h-3.5 w-3.5 mr-1" />
                            Resume
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cover Letter Dialog */}
      <Dialog open={viewCoverLetterDialog} onOpenChange={setViewCoverLetterDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Cover Letter</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            {selectedJob && (
              <>
                <p className="text-sm font-medium text-gray-500">Job Position</p>
                <p className="text-base font-semibold">{selectedJob.title} at {selectedJob.company}</p>
              </>
            )}
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">Cover Letter</p>
              <div className="mt-2 p-4 bg-gray-50 rounded-md text-gray-800 whitespace-pre-wrap">
                {selectedCoverLetter}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setViewCoverLetterDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

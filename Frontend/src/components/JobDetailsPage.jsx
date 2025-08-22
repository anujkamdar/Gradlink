import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, MapPin, Clock, User, ArrowLeft, CalendarIcon, Building, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { Backend_url } from '@/info';
import toast, { Toaster } from 'react-hot-toast';


export default function JobDetailsPage() {
    const navigate = useNavigate();
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");
    const [resumeFile, setResumeFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${Backend_url}/gradlink/api/v1/users/job/${jobId}`,
                    { withCredentials: true }
                );
                setJob(response.data.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching job details:", err);
                setError(err.response?.data?.message || "Failed to load job details");
                setLoading(false);
            }
        };

        if (jobId) {
            fetchJobDetails();
        }
    }, [jobId]);

    const handleApplySubmit = async (e) => {
        // learned new syntax here try-catch-finally
        e.preventDefault();
        if (!resumeFile) {
            toast.error("Please upload your resume");
            return;
        }

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append("jobId", jobId);
            formData.append("coverLetter", coverLetter);
            formData.append("resume", resumeFile);

            const response = await axios.post(
                `${Backend_url}/gradlink/api/v1/users/apply-job`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            toast.success("Application submitted successfully!");
            setIsApplyDialogOpen(false);
            setCoverLetter("");
            setResumeFile(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error submitting application");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type !== 'application/pdf') {
                toast.error("Please upload a PDF file for your resume");
                return;
            }
            console.log((file.size / (1024 * 1024)))
            if (file.size > 10 * 1024 * 1024) {
                toast.error("Please upload within 10MB");
                return;
            }
            setResumeFile(file);
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
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-purple-50 to-indigo-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <div className="mb-6 text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Button
                        onClick={() => navigate('/tabs/jobs')}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                        Return to Jobs
                    </Button>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-purple-50 to-indigo-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <div className="mb-6 text-indigo-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Job Not Found</h2>
                    <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
                    <Button
                        onClick={() => navigate('/tabs/jobs')}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                        Browse All Jobs
                    </Button>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <>
            <Toaster position='top-right' />
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 min-h-screen py-8 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Back button with animated effect */}
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            className="group flex items-center text-indigo-600 hover:text-indigo-800 transition-all duration-300"
                            onClick={() => navigate("/tabs/jobs")}
                        >
                            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                            <span className="font-medium">Back to Jobs</span>
                        </Button>
                    </div>

                    {/* Job Header Card */}
                    <div className="relative mb-10">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl opacity-90 shadow-lg transform -rotate-1"></div>
                        <Card className="relative bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
                            <div className="h-3 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600"></div>
                            <CardContent className="p-8">
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 text-gray-500 mb-3">
                                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 font-medium">
                                                {job.type}
                                            </Badge>
                                            <span>•</span>
                                            <span className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-1 text-indigo-500" />
                                                {job.location}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center">
                                                <CalendarIcon className="w-4 h-4 mr-1 text-indigo-500" />
                                                Posted {formatDate(job.createdAt)}
                                            </span>
                                        </div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                                        <div className="flex items-center text-gray-700">
                                            <Building className="w-5 h-5 mr-2 text-indigo-600" />
                                            <span className="font-medium text-lg">{job.company}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 lg:mt-0">
                                        <Dialog open={isApplyDialogOpen} onOpenChange={(state) => { setIsApplyDialogOpen(state); setResumeFile(null) }}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    size="lg"
                                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 px-6"
                                                    disabled={job.isAlreadyApplied}
                                                >
                                                    {job.isAlreadyApplied ? "Already Applied" : "Apply Now"}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-2xl">
                                                <div className="h-2 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600"></div>
                                                <div className="p-6">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-2xl font-bold text-gray-900">Apply for {job.title}</DialogTitle>
                                                    </DialogHeader>
                                                    <form onSubmit={handleApplySubmit} className="space-y-5 mt-6">
                                                        <div className="space-y-2">
                                                            <label htmlFor="coverLetter" className="font-medium text-gray-700 flex items-center">
                                                                <FileText className="mr-2 h-4 w-4 text-indigo-600" />
                                                                Cover Letter
                                                            </label>
                                                            <Textarea
                                                                id="coverLetter"
                                                                placeholder="Tell us why you're a great fit for this position..."
                                                                value={coverLetter}
                                                                onChange={(e) => setCoverLetter(e.target.value)}
                                                                rows={6}
                                                                required
                                                                className="w-full border-indigo-200 focus:border-indigo-500 resize-none rounded-xl"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label htmlFor="resume" className="font-medium text-gray-700 flex items-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                                Resume (PDF only)
                                                            </label>
                                                            <div className="mt-1">
                                                                <div className="flex items-center justify-center border-2 border-dashed border-indigo-200 rounded-xl p-6 transition-all duration-300 hover:border-indigo-300 bg-indigo-50/50">
                                                                    <div className="space-y-1 text-center">
                                                                        <svg className="mx-auto h-12 w-12 text-indigo-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                        <div className="text-sm text-indigo-600 font-medium">
                                                                            {resumeFile ? (
                                                                                <p className="text-indigo-700">{resumeFile.name}</p>
                                                                            ) : (
                                                                                <p>Upload your resume</p>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-xs text-gray-500">PDF up to 10MB</p>
                                                                        <input
                                                                            id="resume"
                                                                            name="resume"
                                                                            type="file"
                                                                            accept=".pdf"
                                                                            onChange={handleFileChange}
                                                                            required
                                                                            className="sr-only"
                                                                            disabled={isSubmitting}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <label
                                                                    htmlFor="resume"
                                                                    className={`mt-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 w-full ${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
                                                                        }`}

                                                                >
                                                                    {resumeFile ? "Change file" : "Select a file"}
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <DialogFooter className="pt-4 border-t border-gray-100">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() => setIsApplyDialogOpen(false)}
                                                                className="border-indigo-200 text-indigo-700"
                                                                disabled={isSubmitting}
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                type="submit"
                                                                disabled={isSubmitting}
                                                                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                                                            >
                                                                {isSubmitting ? (
                                                                    <>
                                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                        </svg>
                                                                        Submitting...
                                                                    </>
                                                                ) : 'Submit Application'}
                                                            </Button>
                                                        </DialogFooter>
                                                    </form>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Job Description & Skills */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Job Description */}
                            <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white rounded-xl">
                                <div className="h-2 bg-gradient-to-r from-indigo-400 to-purple-500"></div>
                                <CardHeader className="pb-2 pt-6">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                            <Briefcase className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <CardTitle className="text-xl font-bold">Job Description</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose prose-indigo max-w-none">
                                        <p className="whitespace-pre-line text-gray-700 leading-relaxed">{job.description}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Required Skills */}
                            <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white rounded-xl">
                                <div className="h-2 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                                <CardHeader className="pb-2 pt-6">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                        </div>
                                        <CardTitle className="text-xl font-bold">Required Skills</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {job.requiredSkills && job.requiredSkills.map((skill, index) => (
                                            <Badge
                                                key={index}
                                                className="px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-indigo-200 hover:from-indigo-100 hover:to-purple-100 transition-colors duration-300"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                        {(!job.requiredSkills || job.requiredSkills.length === 0) && (
                                            <p className="text-gray-500 italic">No specific skills mentioned</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Job Details & Actions */}
                        <div className="space-y-8">
                            {/* Job Details Card */}
                            <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white rounded-xl">
                                <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                                <CardHeader className="pb-2 pt-6">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <CardTitle className="text-xl font-bold">Job Details</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="flex items-start">
                                        <Briefcase className="w-5 h-5 text-indigo-500 mt-0.5 mr-3 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Job Type</h4>
                                            <p className="font-medium text-gray-900">{job.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <MapPin className="w-5 h-5 text-indigo-500 mt-0.5 mr-3 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Location</h4>
                                            <p className="font-medium text-gray-900">{job.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <User className="w-5 h-5 text-indigo-500 mt-0.5 mr-3 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Posted By</h4>
                                            <p className="font-medium text-gray-900">{job.postedByDetails[0].fullname}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <CalendarIcon className="w-5 h-5 text-indigo-500 mt-0.5 mr-3 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Date Posted</h4>
                                            <p className="font-medium text-gray-900">{formatDate(job.createdAt)}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <Button
                                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-medium shadow-md hover:shadow-lg transition-all duration-300"
                                            onClick={() => setIsApplyDialogOpen(true)}
                                            disabled={job.isAlreadyApplied}
                                        >
                                            <FileText className="mr-2 h-4 w-4" />
                                            {job.isAlreadyApplied ? "Already Applied for this position" : "Apply for this position"}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

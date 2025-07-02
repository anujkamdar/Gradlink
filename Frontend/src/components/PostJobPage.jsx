import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Backend_url } from "../info.js";

export default function PostJobPage() {
    const navigate = useNavigate();
    const [jobForm, setJobForm] = useState({
        title: "",
        company: "",
        location: "",
        type: "",
        description: "",
        requiredSkills: []
    });
    const [currentSkill, setCurrentSkill] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setJobForm({
            ...jobForm,
            [name]: value
        });
        console.log(name);
    };

    const addSkill = () => {

        if (jobForm.requiredSkills.includes(currentSkill.trim())) {
            alert("Skill already added! Please add a different skill.");
        }

        if (currentSkill.trim() && !jobForm.requiredSkills.includes(currentSkill.trim())) {
            setJobForm({
                ...jobForm,
                requiredSkills: [...jobForm.requiredSkills, currentSkill.trim()]
            });
            setCurrentSkill("");
        }
    };

    const removeSkill = (skillToRemove) => {
        setJobForm({
            ...jobForm,
            requiredSkills: jobForm.requiredSkills.filter(skill => skill !== skillToRemove)
        });
    };


    // Handle Enter key press to add skill
    const handleSkillKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Job Form Data:", jobForm);
        try {
            const response = await axios.post(`${Backend_url}/gradlink/api/v1/users/create-job`,jobForm,{withCredentials: true});
            console.log("Job posted successfully:", response.data);
            navigate("/tabs/jobs")
        } catch (error) {
            console.error("Error posting job:", error);
            alert(error.response.data.message);
        }
    };


    // here using required keyword rather than using alert as it looks better

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                className="mr-2"
                                onClick={() => navigate("/tabs/jobs")}
                            >
                                <ArrowLeft />
                            </Button>
                            <h2 className="text-2xl font-bold text-gray-900 mb-0.5">Post a Job</h2> {/* Found mb-0.5 to make symmetry */}
                        </div>
                    </div>

                    {/* Job Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Job Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Job Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">Job Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="e.g. Software Engineer"
                                        value={jobForm.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                {/* Company */}
                                <div className="space-y-2">
                                    <Label htmlFor="company">Company</Label>
                                    <Input
                                        id="company"
                                        name="company"
                                        placeholder="e.g. Tech Solutions Inc."
                                        value={jobForm.company}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                {/* Location and Type - Two columns */}
                                {/* abhi using simple select ekbaar i will figure out how to use the shadcn one with the same style */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <select
                                            id="location"
                                            name="location"
                                            className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={jobForm.location}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Location</option>
                                            <option value="Remote">Remote</option>
                                            <option value="Delhi">Delhi</option>
                                            <option value="Mumbai">Mumbai</option>
                                            <option value="Bangalore">Bangalore</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Job Type</Label>
                                        <select
                                            id="type"
                                            name="type"
                                            className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={jobForm.type}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Job Type</option>
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Internship">Internship</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Job Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Job Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Describe the role, responsibilities, qualifications, etc."
                                        value={jobForm.description}
                                        onChange={handleInputChange}
                                        rows={6}
                                        required
                                    />
                                </div>

                                {/* Skills */}
                                <div className="space-y-2">
                                    <Label htmlFor="requiredSkills">Required Skills</Label>
                                    <div className="flex">
                                        <Input
                                            id="requiredSkills"
                                            name="requiredSkills"
                                            placeholder="e.g. React, Node.js, MongoDB"
                                            value={currentSkill}
                                            onChange={(e) => setCurrentSkill(e.target.value)}
                                            onKeyPress={handleSkillKeyPress}
                                            className="flex-grow"
                                        />
                                        <Button
                                            type="button"
                                            onClick={addSkill}
                                            className="ml-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {jobForm.requiredSkills.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {jobForm.requiredSkills.map((skill, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200"
                                                >
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSkill(skill)}
                                                        className="ml-1 text-blue-700 hover:text-blue-900"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="mr-2"
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">Post Job</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

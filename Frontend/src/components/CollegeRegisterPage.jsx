import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, X, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Backend_url } from '@/info';

export default function CollegeRegisterPage() {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [collegeForm, setCollegeForm] = useState({
        email: "",
        phoneNumber: "",
        collegeName: "",
        location: "",
        majors: [],
        logo: null,
        admin: {
            name: "",
            email: "",
            password: "",
            avatar: null
        }
    });



    const [majorInput, setMajorInput] = useState("");
    const [logoPreview, setLogoPreview] = useState(null);
    const [adminAvatarPreview, setAdminAvatarPreview] = useState(null); const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Check if this is an admin field (contains admin.)
        if (name.startsWith('admin.')) {
            const adminField = name.split('.')[1];
            setCollegeForm({
                ...collegeForm,
                admin: {
                    ...collegeForm.admin,
                    [adminField]: value
                }
            });
        } else {
            setCollegeForm({
                ...collegeForm,
                [name]: value
            });
        }
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCollegeForm({
                ...collegeForm,
                logo: file
            });

            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAdminAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCollegeForm({
                ...collegeForm,
                admin: {
                    ...collegeForm.admin,
                    avatar: file
                }
            });

            const reader = new FileReader();
            reader.onloadend = () => {
                setAdminAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const addMajor = () => {
        if (majorInput.trim() && !collegeForm.majors.includes(majorInput.trim())) {
            setCollegeForm({
                ...collegeForm,
                majors: [...collegeForm.majors, majorInput.trim()]
            });
            setMajorInput("");
        }
    };

    const removeMajor = (majorToRemove) => {
        setCollegeForm({
            ...collegeForm,
            majors: collegeForm.majors.filter(major => major !== majorToRemove)
        });
    };

    const handleMajorKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addMajor();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const collegeFormData = new FormData();
        collegeFormData.append('collegeEmail', collegeForm.email);
        collegeFormData.append('phoneNumber', collegeForm.phoneNumber);
        collegeFormData.append('collegeName', collegeForm.collegeName);
        collegeFormData.append('location', collegeForm.location);
        collegeFormData.append('majors', JSON.stringify(collegeForm.majors));
        collegeFormData.append('fullname', collegeForm.admin.name);
        collegeFormData.append('adminEmail', collegeForm.admin.email);
        collegeFormData.append('password', collegeForm.admin.password);

        if (collegeForm.logo) {
            collegeFormData.append('logo', collegeForm.logo);
        }

        if (collegeForm.admin.avatar) {
            collegeFormData.append('avatar', collegeForm.admin.avatar);
        }

        console.log(collegeFormData);
        try {
            const response = await axios.post(`${Backend_url}/gradlink/api/v1/users/register-college-and-admin`, collegeFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("College registered successfully:", response.data);
            setSubmitting(false);
            alert("College registered successfully!");
        } catch (error) {
            console.error("Error registering college:", error);
            alert(error.response?.data?.message || "Registration failed. Please try again.");
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                className="mr-2"
                                onClick={() => navigate("/")}
                            >
                                <ArrowLeft />
                            </Button>
                            <h2 className="text-2xl font-bold text-gray-900 mb-0.5">College Registration</h2>
                        </div>
                    </div>

                    {/* Form Container */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* College Details Card */}
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle>College Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Official College Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="college@university.edu"
                                            value={collegeForm.email}
                                            onChange={handleInputChange}
                                            required
                                            disabled={submitting}
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phoneNumber">Phone Number</Label>
                                        <Input
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            type="tel"
                                            placeholder="+1 (123) 456-7890"
                                            value={collegeForm.phoneNumber}
                                            onChange={handleInputChange}
                                            required
                                            disabled={submitting}
                                        />
                                    </div>

                                    {/* College Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="collegeName">College Name</Label>
                                        <Input
                                            id="collegeName"
                                            name="collegeName"
                                            placeholder="e.g. Massachusetts Institute of Technology"
                                            value={collegeForm.collegeName}
                                            onChange={handleInputChange}
                                            required
                                            disabled={submitting}
                                        />
                                    </div>

                                    {/* Location */}
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            name="location"
                                            placeholder="e.g. Cambridge, Massachusetts"
                                            value={collegeForm.location}
                                            onChange={handleInputChange}
                                            required
                                            disabled={submitting}
                                        />
                                    </div>

                                    {/* Majors Offered */}
                                    <div className="space-y-2">
                                        <Label htmlFor="majorsOffered">Majors Offered</Label>
                                        <div className="flex">
                                            <Input
                                                id="majorsOffered"
                                                placeholder="e.g. Computer Science, Electrical Engineering"
                                                value={majorInput}
                                                onChange={(e) => setMajorInput(e.target.value)}
                                                onKeyPress={handleMajorKeyPress}
                                                className="flex-grow"
                                                disabled={submitting}
                                            />
                                            <Button
                                                type="button"
                                                onClick={addMajor}
                                                className="ml-2"
                                                disabled={!majorInput.trim() || submitting}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        {collegeForm.majors.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {collegeForm.majors.map((major, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="secondary"
                                                        className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200"
                                                    >
                                                        {major}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeMajor(major)}
                                                            className="ml-1 text-blue-700 hover:text-blue-900"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* College Logo */}
                                    <div className="space-y-2">
                                        <Label htmlFor="collegeLogo">College Logo</Label>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                {logoPreview ? (
                                                    <div className="w-20 h-20 rounded-md overflow-hidden">
                                                        <img
                                                            src={logoPreview}
                                                            alt="College Logo Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-md">
                                                        <Upload className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <Input
                                                    id="collegeLogo"
                                                    name="collegeLogo"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    required
                                                    className="w-full cursor-pointer"
                                                    disabled={submitting}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Upload a square logo image in PNG or JPG format (max 2MB)</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Admin Details Card */}
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle>Admin Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Admin Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="admin-name">Admin Name</Label>
                                        <Input
                                            id="admin-name"
                                            name="admin.name"
                                            placeholder="Full Name"
                                            value={collegeForm.admin.name}
                                            onChange={handleInputChange}
                                            required
                                            disabled={submitting}
                                        />
                                    </div>

                                    {/* Admin Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="admin-email">Admin Email</Label>
                                        <Input
                                            id="admin-email"
                                            name="admin.email"
                                            type="email"
                                            placeholder="admin@example.com"
                                            value={collegeForm.admin.email}
                                            onChange={handleInputChange}
                                            required
                                            disabled={submitting}
                                        />
                                    </div>

                                    {/* Admin Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="admin-password">Admin Password</Label>
                                        <Input
                                            id="admin-password"
                                            name="admin.password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={collegeForm.admin.password}
                                            onChange={handleInputChange}
                                            required
                                            disabled={submitting}
                                        />
                                    </div>

                                    {/* Admin Avatar */}
                                    <div className="space-y-2">
                                        <Label htmlFor="admin-avatar">Admin Avatar</Label>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                {adminAvatarPreview ? (
                                                    <div className="w-20 h-20 rounded-full overflow-hidden">
                                                        <img
                                                            src={adminAvatarPreview}
                                                            alt="Admin Avatar Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full">
                                                        <Upload className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <Input
                                                    id="admin-avatar"
                                                    name="admin-avatar"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAdminAvatarChange}
                                                    required
                                                    className="w-full cursor-pointer"
                                                    disabled={submitting}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Upload a profile picture (max 2MB)</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                className="mr-2"
                                onClick={() => navigate("/")}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? <><span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>Submitting</>: <span>Register College</span>}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

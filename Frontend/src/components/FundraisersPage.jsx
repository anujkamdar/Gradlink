import { useState, useEffect } from "react";
import { DollarSign, Calendar, Users, ExternalLink, PlusCircle } from "lucide-react";
import axios from "axios";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Progress } from "./ui/progress";
import { Backend_url } from "@/info";
import DonationModal from "./DonationModal";
import StripeProvider from "./StripeProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

export default function FundraisersPage() {
    const [fundraisers, setFundraisers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFundraiser, setSelectedFundraiser] = useState(null);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isAddingFundraiser, setIsAddingFundraiser] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        targetAmount: "",
        coverImage: null,
        category: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchFundraisers = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${Backend_url}/gradlink/api/v1/users/get-fundraisers`,
                    { withCredentials: true }
                );
                console.log(response.data.data);
                setFundraisers(response.data.data);
                setLoading(false);
            } catch (error) {
                console.log("Error fetching fundraisers:", error.response?.data?.message || error.message);
                setError(error.response?.data?.message || "Failed to load fundraisers");
                setLoading(false);
            }
        };

        fetchFundraisers();
    }, []);

    const getCurrentUser = async () => {
        try {
            const response = await axios.get(`${Backend_url}/gradlink/api/v1/users/current-user-profile`, { withCredentials: true });
            setUser(response.data.data);
        } catch (error) {
            console.log(error.response?.data?.message || "Error fetching user data");
        }
    };

    useEffect(() => {
        getCurrentUser();
    }, []);

    const calculateProgress = (current, target) => {
        return (current / target) * 100;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleDonateClick = (fundraiser) => {
        setSelectedFundraiser(fundraiser);
        setIsDonationModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsDonationModalOpen(false);
        // Refetch fundraisers to get updated amounts after donation
        const fetchFundraisers = async () => {
            try {
                const response = await axios.get(`${Backend_url}/gradlink/api/v1/users/get-fundraisers`,
                    { withCredentials: true }
                );
                setFundraisers(response.data.data);
            } catch (error) {
                console.log("Error fetching fundraisers:", error.response?.data?.message || error.message);
            }
        };
        fetchFundraisers();
    };


    const handleCloseAddFundraiser = () => {
        setIsAddingFundraiser(false);
        setFormData({
            title: "",
            description: "",
            targetAmount: "",
            coverImage: null,
            category: ""
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            coverImage: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const formDataToSubmit = new FormData();
            formDataToSubmit.append("title", formData.title);
            formDataToSubmit.append("description", formData.description);
            formDataToSubmit.append("targetAmount", formData.targetAmount);
            formDataToSubmit.append("category", formData.category);
            if (formData.coverImage) {
                formDataToSubmit.append("coverImage", formData.coverImage);
            }
            if (formData.targetAmount <= 0) {
                alert("Target amount must be greater than 0");
                return;
            }
            const response = await axios.post(`${Backend_url}/gradlink/api/v1/users/create-fundraiser`, formDataToSubmit, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            });

            console.log("Fundraiser created:", response.data);
            setFundraisers([...fundraisers, response.data.data]);
            alert("Fundraiser created successfully!");
            setIsAddingFundraiser(false);
            setIsSubmitting(false);
            setFormData({
                title: "",
                description: "",
                targetAmount: "",
                coverImage: null,
                category: ""
            });
        } catch (error) {
            alert(error.response?.data?.message || "Failed to create fundraiser");
            setIsSubmitting(false);
        }
    };



    // use this type of loading state to show a skeleton loader in all pages TODO later
    if (loading) {
        return (
            <div className="container mx-auto py-10 flex justify-center">
                <div className="animate-pulse flex flex-col space-y-4 w-full max-w-3xl">
                    <div className="h-10 bg-gray-200 rounded w-1/2 mb-4"></div>
                    {[1, 2, 3].map((_, index) => (
                        <div key={index} className="h-60 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-10 flex justify-center">
                <div className="bg-red-50 border border-red-200 rounded-md p-6 max-w-2xl w-full">
                    <h2 className="text-red-600 text-lg font-medium">Error</h2>
                    <p className="text-red-500 mt-2">{error}</p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Fundraisers</h1>
                            <p className="text-gray-600">Support initiatives from your alma mater and make a difference.</p>
                        </div>
                        <div className="flex items-center space-x-3 mt-4 md:mt-0">
                            <Button
                                variant="outline"
                                onClick={() => window.location.href = '/tabs/my-donations'}
                                className="flex items-center border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                            >
                                <DollarSign className="h-4 w-4 mr-2" />
                                View My Donations
                            </Button>
                            
                            {user?.role === 'admin' && (
                                <Dialog open={isAddingFundraiser} onOpenChange={(state) => {
                                    setIsAddingFundraiser(state);
                                    if (!state) {
                                        setFormData({
                                            title: "",
                                            description: "",
                                            targetAmount: "",
                                            coverImage: null,
                                            coverImagePreview: null,
                                            category: ""
                                        });
                                    }
                                }}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                                            <PlusCircle className="h-4 w-4 mr-2" />
                                            Add Fundraiser
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden py-6 px-6">
                                        <DialogHeader className="mb-4">
                                            <DialogTitle>Create a new Fundraiser</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div>
                                                <Label htmlFor="title">Title</Label>
                                                <Input
                                                    id="title"
                                                    name="title"
                                                    value={formData.title}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter fundraiser title"
                                                    required
                                                    className="mt-1"
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="description">Description</Label>
                                                <Textarea
                                                    id="description"
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter fundraiser description"
                                                    required
                                                    className="mt-1"
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <Label htmlFor="targetAmount">Target Amount</Label>
                                                    <Input
                                                        id="targetAmount"
                                                        name="targetAmount"
                                                        type="number"
                                                        value={formData.targetAmount}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter target amount"
                                                        required
                                                        className="mt-1"
                                                        disabled={isSubmitting}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="category">Category</Label>
                                                    <Input
                                                        id="category"
                                                        name="category"
                                                        value={formData.category}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter category"
                                                        className="mt-1"
                                                        required
                                                        disabled={isSubmitting}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label htmlFor="coverImage">Cover Image</Label>
                                                <Input
                                                    id="coverImage"
                                                    name="coverImage"
                                                    type="file"
                                                    accept="image/*"
                                                    required
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            setFormData({
                                                                ...formData,
                                                                coverImage: file,
                                                                coverImagePreview: URL.createObjectURL(file)
                                                            });
                                                        } else {
                                                            setFormData({
                                                                ...formData,
                                                                coverImage: null,
                                                                coverImagePreview: null
                                                            });
                                                        }
                                                    }}
                                                    className="mt-1"
                                                    disabled={isSubmitting}
                                                />
                                                {formData.coverImagePreview && (
                                                    <div className="mt-2">
                                                        <img
                                                            src={formData.coverImagePreview}
                                                            alt="Cover"
                                                            className="h-32 w-full object-cover rounded-md"
                                                            onError={(e) => {
                                                                e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                type="submit"
                                                className="bg-indigo-600 hover:bg-indigo-700 w-full"
                                                disabled={isSubmitting}
                                            >
                                                <DollarSign className="h-4 w-4 mr-2" />
                                                {isSubmitting ? "Creating..." : "Create Fundraiser"}
                                            </Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {fundraisers.map((fundraiser) => (
                        <Card key={fundraiser._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            {fundraiser.coverImage && (
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={fundraiser.coverImage}
                                        alt={fundraiser.title}
                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            )}
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl">{fundraiser.title}</CardTitle>
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                        {fundraiser.category || "General"}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="">
                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {fundraiser.description}
                                </p>
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium">{formatCurrency(fundraiser.currentAmount || 0)} raised</span>
                                        <span className="text-gray-600">of {formatCurrency(fundraiser.targetAmount || 0)}</span>
                                    </div>
                                    <Progress
                                        value={calculateProgress(fundraiser.currentAmount || 0, fundraiser.targetAmount || 0)}
                                        indicatorClassName={`${calculateProgress(fundraiser.currentAmount, fundraiser.targetAmount) >= 80 ? 'bg-green-600' : calculateProgress(fundraiser.currentAmount, fundraiser.targetAmount) <= 30 ? 'bg-red-600' : 'bg-yellow-400'}`}
                                    />
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 mt-4">
                                    <span className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {new Date(fundraiser.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center">
                                        <Users className="h-4 w-4 mr-1" />
                                        {fundraiser.donationsCount} Donations Made
                                    </span>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-gray-50 border-t border-gray-100 p-4">
                                <Button 
                                    className="w-full" 
                                    size="sm" 
                                    onClick={() => handleDonateClick(fundraiser)}
                                >
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    Donate Now
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
            
            {/* Wrap the DonationModal with StripeProvider */}
            {selectedFundraiser && (
                <StripeProvider>
                    <DonationModal 
                        isOpen={isDonationModalOpen} 
                        onClose={handleCloseModal} 
                        fundraiser={selectedFundraiser} 
                    />
                </StripeProvider>
            )}
        </div>
    );
}

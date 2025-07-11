import { useState, useEffect } from "react";
import { DollarSign, Calendar, Users, ExternalLink } from "lucide-react";
import axios from "axios";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Progress } from "./ui/progress";
import { Backend_url } from "@/info";
import DonationModal from "./DonationModal";
import StripeProvider from "./StripeProvider";

export default function FundraisersPage() {
    const [fundraisers, setFundraisers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFundraiser, setSelectedFundraiser] = useState(null);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

    useEffect(() => {
        const fetchFundraisers = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${Backend_url}/gradlink/api/v1/users/get-fundraisers`,
                    { withCredentials: true }
                );
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
                        <Button
                            variant="outline"
                            onClick={() => window.location.href = '/tabs/my-donations'}
                            className="flex items-center mt-4 md:mt-0 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                            <DollarSign className="h-4 w-4 mr-2" />
                            View My Donations
                        </Button>
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
                                        {Math.floor(Math.random() * 50) + 5} donors
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

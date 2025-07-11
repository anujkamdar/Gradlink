import { useState, useEffect } from "react";
import axios from "axios";
import { Backend_url } from "@/info";
import { CalendarIcon, DollarSignIcon, ExternalLinkIcon, HeartIcon, ArrowRightIcon, GiftIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export default function MyDonationsPage() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${Backend_url}/gradlink/api/v1/users/get-my-donations`,
                    { withCredentials: true }
                );
                setDonations(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error(
                    "Error fetching donations:",
                    error.response?.data?.message || error.message
                );
                setError(error.response?.data?.message || "Failed to load donations");
                setLoading(false);
            }
        };

        fetchDonations();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getAmountGradient = (amount) => {
        if (amount >= 10000) return "from-purple-500 to-indigo-600";
        if (amount >= 5000) return "from-blue-500 to-cyan-500";
        if (amount >= 1000) return "from-teal-400 to-emerald-500";
        return "from-emerald-400 to-green-500";
    };

    const calctotalAmount = (arr) => {
        let sum = 0;
        for(let element of arr){
            sum = sum  + element.amount;
        }
        return sum;
    }



    if (loading) {
        return (
            <div className="container mx-auto py-10 px-4">
                <div className="mb-8">
                    <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/2 mt-2 animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-xl overflow-hidden shadow-md bg-white">
                            <div className="h-40 bg-gray-200 animate-pulse"></div>
                            <div className="p-5 space-y-3">
                                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                                <div className="h-10 bg-gray-200 rounded w-1/3 mt-4 animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-10 flex justify-center px-4">
                <div className="bg-red-50 border-l-4 border-red-500 rounded-md p-6 max-w-2xl w-full shadow-md">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-lg font-semibold text-red-800">Error Loading Donations</h2>
                            <p className="text-red-700 mt-1">{error}</p>
                            <Button
                                className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => window.location.reload()}
                            >
                                Try Again
                            </Button>
                        </div>
                    </div>
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Donations</h1>
                            <p className="text-gray-600">
                                Your generous contributions making a difference.
                            </p>
                        </div>
                        <Button
                            className="mt-4 md:mt-0"
                            onClick={() => window.location.href = '/tabs/fundraisers'}
                        >
                            <GiftIcon className="h-4 w-4 mr-2" />
                            Browse Fundraisers
                        </Button>
                    </div>

                    {donations.length > 0 && (
                        <div className="mt-8 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Donation Summary</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                                <div className="bg-indigo-50 p-4 rounded-lg">
                                    <p className="text-indigo-600 text-sm font-medium">Total Donated</p>
                                    <p className="text-2xl font-bold text-indigo-700">
                                        {formatCurrency(calctotalAmount(donations))}
                                    </p>
                                </div>
                                <div className="bg-emerald-50 p-4 rounded-lg">
                                    <p className="text-emerald-600 text-sm font-medium">Donation Count</p>
                                    <p className="text-2xl font-bold text-emerald-700">{donations.length}</p>
                                </div>
                                <div className="bg-amber-50 p-4 rounded-lg">
                                    <p className="text-amber-600 text-sm font-medium">Last Donation</p>
                                    <p className="text-lg font-bold text-amber-700">
                                        {formatDate(donations[0].createdAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {donations.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-10 text-center border border-gray-100">
                        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100">
                            <HeartIcon className="h-8 w-8 text-indigo-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            No donations yet
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            You haven't made any donations yet. Support a cause that matters to you and make a difference in your alma mater's community.
                        </p>
                        <Button
                            onClick={() => window.location.href = '/tabs/fundraisers'}
                            className="mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                        >
                            Explore Fundraisers
                            <ArrowRightIcon className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {donations.map((donation) => {
                            const amountGradient = getAmountGradient(donation.amount);
                            return (
                                <Card key={donation._id} className="overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-0">
                                    <div className="h-48 relative overflow-hidden">

                                        <img
                                            src={donation.fundraiserDetails.coverImage}
                                            alt={donation.fundraiserDetails.title || "Donation"}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 p-4 w-full">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <h3 className="text-white font-bold text-xl mb-1 line-clamp-1">
                                                        {donation.fundraiserDetails?.title || "Donation"}
                                                    </h3>
                                                    <p className="text-white/80 text-sm">
                                                        Made on {formatDate(donation.createdAt)}
                                                    </p>
                                                </div>
                                                <Badge className={`bg-gradient-to-r ${amountGradient} text-white border-0 text-sm py-1.5`}>
                                                    {formatCurrency(donation.amount)}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <CardContent className="p-5">
                                        <div className="space-y-3">
                                            {donation.fundraiserDetails && (
                                                <p className="text-gray-700 line-clamp-2">
                                                    {donation.fundraiserDetails.description}
                                                </p>
                                            )}
                                            <div className="flex items-center text-gray-500 text-sm pt-2">
                                                <div className="flex items-center">
                                                    <DollarSignIcon className="h-4 w-4 mr-1 text-emerald-500" />
                                                    <span>Transaction ID: {donation._id}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                    {donation.fundraiserDetails && (
                                        <CardFooter className="bg-gray-50 border-t px-5 py-3 flex items-center justify-center">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <HeartIcon className="h-4 w-4 mr-1 text-red-500" />
                                                <span>Thank you for your support!</span>
                                            </div>
                                        </CardFooter>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

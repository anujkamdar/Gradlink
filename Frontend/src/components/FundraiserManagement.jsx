import { useState, useEffect } from "react";
import {
    DollarSign,
    PlusCircle,
    Edit,
    Trash,
    Eye,
    ChevronRight,
    X
} from "lucide-react";
import axios from "axios";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";


function FundraiserManagement() {
    const [fundraisers, setFundraisers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFundraiser, setSelectedFundraiser] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        targetAmount: "",
        coverImage: null,
    });
    const [isAddingFundraiser, setIsAddingFundraiser] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchFundraisers = async () => {
            try {
                const response = await axios.get("http://localhost:8000/gradlink/api/v1/users/get-fundraisers", { withCredentials: true })
                console.log(response);
                setFundraisers(response.data.data)
                setLoading(false);
            } catch (error) {
                console.log(error.response?.data?.message || "something went wrong");
                setLoading(false);
            }
        };

        fetchFundraisers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleViewDetails = (fundraiser) => {
        setSelectedFundraiser(fundraiser);
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

            const response = await axios.post("http://localhost:8000/gradlink/api/v1/users/create-fundraiser", formDataToSubmit, { withCredentials: true })
            console.log("Fundraiser created:", response.data);
            setFundraisers([...fundraisers, response.data]);
            alert("Fundraiser created successfully!");
            setIsAddingFundraiser(false);
            setIsSubmitting(false);
            setFormData({
                title: "",
                description: "",
                targetAmount: "",
                coverImage: null,
            });
        } catch (error) {
            alert(error.response?.data?.message || "Failed to create fundraiser");
            setIsSubmitting(false);
        }
    };

    const getProgressPercentage = (current, target) => {
        return Math.min(100, Math.round((current / target) * 100));
    };


    return (
        <div className="bg-white shadow rounded-lg">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium">Fundraiser Management</h2>
                <Dialog open={isAddingFundraiser} onOpenChange={(state) => {
                    setIsAddingFundraiser(state);
                    if (!state) {
                        setFormData({ ...formData, coverImage: null })
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
                                                coverImage: URL.createObjectURL(file)
                                            });
                                        } else {
                                            setFormData({
                                                ...formData,
                                                coverImage: null
                                            });
                                        }
                                    }}
                                    className="mt-1"
                                    disabled={isSubmitting}
                                />
                                {formData.coverImage && (
                                    <div className="mt-2">
                                        <img
                                            src={formData.coverImage}
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
            </div>



            <div className="p-6">
                <div className="grid grid-cols-1 gap-6">
                    {loading ? (
                        <p className="text-center py-8 text-gray-500">Loading fundraisers...</p>
                    ) : fundraisers.length === 0 ? (
                        <p className="text-center py-8 text-gray-500">No fundraisers found.</p>
                    ) : (
                        fundraisers.map((fundraiser) => (
                            <Card key={fundraiser.id} className="overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {/* Image Column */}
                                    <div className="aspect-video md:col-span-1">
                                        <img
                                            src={fundraiser.coverImage}
                                            alt={fundraiser.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {/* Content Column */}
                                    <div className="p-4 md:col-span-3">
                                        <div className="flex justify-between">
                                            <h3 className="font-semibold text-lg mb-1">{fundraiser.title}</h3>
                                        </div>

                                        <div className="mt-3 mb-2">
                                            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${fundraiser.status === 'completed' ? 'bg-blue-600' : 'bg-green-600'}`}
                                                    style={{ width: `${getProgressPercentage(fundraiser.currentAmount, fundraiser.targetAmount)}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between text-sm mb-3">
                                            <span>
                                                <span className="font-semibold">₹ {fundraiser.currentAmount.toLocaleString("en-IN")}</span> raised
                                            </span>
                                            <span className="font-semibold">₹ {fundraiser.targetAmount.toLocaleString("en-IN")} goal</span>
                                        </div>

                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>{fundraiser.donors} donors</span>
                                        </div>

                                        <div className="mt-4 flex items-center justify-end space-x-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleViewDetails(fundraiser)}
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" /> View
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[850px] p-6">
                                                    {selectedFundraiser && (
                                                        <>
                                                            <DialogHeader className="flex items-start justify-between">
                                                                <div>
                                                                    <DialogTitle className="text-xl">{selectedFundraiser.title}</DialogTitle>
                                                                    <p className="text-sm text-gray-500 mt-1">{selectedFundraiser.college.collegeName}</p>
                                                                </div>
                                                                <span className={`px-3 py-1 rounded-full text-sm ${selectedFundraiser.status === 'active'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-blue-100 text-blue-800'
                                                                    }`}>
                                                                    {selectedFundraiser.status === 'active' ? 'Active' : 'Completed'}
                                                                </span>
                                                            </DialogHeader>

                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                                                                <div className="md:col-span-1">
                                                                    <img
                                                                        src={selectedFundraiser.coverImage || "https://via.placeholder.com/400x300?text=No+Image"}
                                                                        alt={selectedFundraiser.title}
                                                                        className="w-full h-auto rounded-md object-cover"
                                                                        onError={(e) => {
                                                                            e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                                                                        }}
                                                                    />

                                                                    <div className="mt-4 space-y-4">
                                                                        <div>
                                                                            <h4 className="text-sm font-medium text-gray-500">College Information</h4>
                                                                            <p className="mt-1">{selectedFundraiser.college.collegeName}</p>
                                                                        </div>

                                                                        <div>
                                                                            <h4 className="text-sm font-medium text-gray-500">Category</h4>
                                                                            <p className="mt-1">{selectedFundraiser.category}</p>
                                                                        </div>

                                                                        <div>
                                                                            <h4 className="text-sm font-medium text-gray-500">Created</h4>
                                                                            <p className="mt-1">{new Date(selectedFundraiser.createdAt).toLocaleDateString()}</p>
                                                                        </div>

                                                                        <div>
                                                                            <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                                                                            <p className="mt-1">{new Date(selectedFundraiser.updatedAt).toLocaleDateString()}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="md:col-span-2">
                                                                    <div>
                                                                        <h3 className="text-lg font-medium">Funding Progress</h3>
                                                                        <div className="text-3xl font-bold mt-2">
                                                                            {getProgressPercentage(selectedFundraiser.currentAmount, selectedFundraiser.targetAmount)}%
                                                                        </div>
                                                                        <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                                                            <div
                                                                                className={`h-full ${selectedFundraiser.status === 'completed' ? 'bg-blue-600' : 'bg-green-600'}`}
                                                                                style={{ width: `${getProgressPercentage(selectedFundraiser.currentAmount, selectedFundraiser.targetAmount)}%` }}
                                                                            ></div>
                                                                        </div>
                                                                        <div className="flex justify-between mt-1">
                                                                            <span className="text-lg font-medium">${selectedFundraiser.currentAmount.toLocaleString()}</span>
                                                                            <span className="text-lg font-medium">${selectedFundraiser.targetAmount.toLocaleString()}</span>
                                                                        </div>
                                                                        <div className="flex justify-between text-sm text-gray-500">
                                                                            <span>Raised</span>
                                                                            <span>Goal</span>
                                                                        </div>

                                                                        <div className="mt-6">
                                                                            <div className="flex items-center space-x-4">
                                                                                <div className="text-center">
                                                                                    <span className="block text-2xl font-bold">{selectedFundraiser.donors}</span>
                                                                                    <span className="text-sm text-gray-500">Donors</span>
                                                                                </div>
                                                                                <div className="text-center">
                                                                                    <span className="block text-2xl font-bold">{selectedFundraiser.endDate}</span>
                                                                                    <span className="text-sm text-gray-500">End Date</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="mt-6">
                                                                            <h3 className="text-lg font-medium">Description</h3>
                                                                            <p className="mt-2 text-gray-700">{selectedFundraiser.description}</p>
                                                                        </div>

                                                                        {/* <div className="mt-8 flex justify-end space-x-4">
                                                                            <Button variant="outline" size="sm">
                                                                                <Edit className="h-4 w-4 mr-1" /> Edit
                                                                            </Button>
                                                                            <Button variant="destructive" size="sm">
                                                                                <Trash className="h-4 w-4 mr-1" /> Delete
                                                                            </Button>
                                                                        </div> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </DialogContent>
                                            </Dialog>

                                            {/* <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4 mr-1" /> Edit
                                            </Button>
                                            <Button variant="destructive" size="sm">
                                                <Trash className="h-4 w-4 mr-1" /> Delete
                                            </Button> */}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default FundraiserManagement;

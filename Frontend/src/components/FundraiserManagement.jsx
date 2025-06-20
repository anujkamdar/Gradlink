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
import { Select } from "./ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/Popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";

function FundraiserManagement() {
    const [fundraisers, setFundraisers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFundraiser, setSelectedFundraiser] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        targetAmount: "",
        college: "",
        coverImageFile: null,
        coverImagePreview: null
    });

    useEffect(() => {
        const fetchFundraisers = async () => {
            try {
                setFundraisers([
                    {
                        id: "1",
                        title: "New Computer Lab Equipment",
                        description: "Raising funds to upgrade our computer science lab with latest hardware and software for better learning experience.",
                        coverImage: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
                        targetAmount: 50000,
                        currentAmount: 1000,
                        college: {
                            _id: "101",
                            collegeName: "Stanford University"
                        },
                        donors: 145,
                        createdAt: "2024-01-15",
                        updatedAt: "2024-01-20",
                        category: "Infrastructure",
                        status: "active"
                    },
                    {
                        id: "2",
                        title: "Student Scholarship Fund",
                        description: "Supporting underprivileged students with scholarships to pursue their dreams in higher education.",
                        coverImage: "https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg",
                        targetAmount: 100000,
                        currentAmount: 100000,
                        college: {
                            _id: "102",
                            collegeName: "MIT"
                        },
                        donors: 287,
                        createdAt: "2023-10-05",
                        updatedAt: "2024-01-05",
                        category: "Education",
                        status: "completed"
                    }
                ]);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch fundraisers:", error);
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData({
                    ...formData,
                    coverImageFile: file,
                    coverImagePreview: e.target.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleViewDetails = (fundraiser) => {
        setSelectedFundraiser(fundraiser);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Here you would normally send the data to your backend API
            const newFundraiser = {
                id: String(fundraisers.length + 1),
                title: formData.title,
                description: formData.description,
                coverImage: formData.coverImagePreview || "https://example.com/placeholder.jpg",
                targetAmount: parseFloat(formData.targetAmount),
                currentAmount: 0,
                college: colleges.find(c => c._id === formData.college),
                donors: 0,
                endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                category: "Other",
                status: "active"
            };

            // Add the new fundraiser to the list (in a real app, you'd wait for API confirmation)
            setFundraisers([...fundraisers, newFundraiser]);

            // Reset form
            setFormData({
                title: "",
                description: "",
                targetAmount: "",
                college: "",
                coverImageFile: null,
                coverImagePreview: null
            });    // Close any open dialogs
            document.getElementById('closeAddDialog').click();

            // Show success message
            alert("Fundraiser created successfully!");
        } catch (error) {
            console.error("Error creating fundraiser:", error);
            alert("Failed to create fundraiser. Please try again.");
        }
    };

    const getProgressPercentage = (current, target) => {
        return Math.min(100, Math.round((current / target) * 100));
    };

    
    return (
        <div className="bg-white shadow rounded-lg">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium">Fundraiser Management</h2>
                <Dialog>
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
                                    onChange={handleFileChange}
                                    className="mt-1"
                                />
                                {formData.coverImagePreview && (
                                    <div className="mt-2">
                                        <img
                                            src={formData.coverImagePreview}
                                            alt="Cover Preview"
                                            className="w-full h-48 object-cover rounded-md"
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
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
                                        // onError={(e) => {
                                        //     e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                                        // }}
                                        />
                                    </div>

                                    {/* Content Column */}
                                    <div className="p-4 md:col-span-3">
                                        <div className="flex justify-between">
                                            <h3 className="font-semibold text-lg mb-1">{fundraiser.title}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs ${fundraiser.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {fundraiser.status === 'active' ? 'Active' : 'Completed'}
                                            </span>
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
                                                <span className="font-semibold">${fundraiser.currentAmount.toLocaleString()}</span> raised
                                            </span>
                                            <span className="font-semibold">${fundraiser.targetAmount.toLocaleString()} goal</span>
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

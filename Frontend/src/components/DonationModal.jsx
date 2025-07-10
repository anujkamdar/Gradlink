import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Backend_url } from "@/info";
import { DollarSign, Users, Calendar, Target } from "lucide-react";

export default function DonationModal({ isOpen, onClose, fundraiser }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const stripe = useStripe();
  const elements = useElements();
  
  const donationOptions = [100, 500, 1000, 5000];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `${Backend_url}/gradlink/api/v1/users/create-payment-intent`,
        {
          fundraiserId: fundraiser._id,
          amount: Number(amount)
        },
        { withCredentials: true }
      );
      
      const { clientSecret } = response.data?.data;
      
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'Anonymous Donor',
          },
        },
      });
      
      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (result.paymentIntent.status === 'succeeded') {
        try {
          const saveResponse = await axios.post(
            `${Backend_url}/gradlink/api/v1/users/save-donation`,
            {
              amount: Number(amount),
              fundraiserId: fundraiser._id,
              paymentIntentId: result.paymentIntent.id,
            },
            { withCredentials: true }
          );
          
          if (saveResponse.status === 201) {
            setSuccess(true);
          } else {
            setError("Error saving donation. Please contact support.");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Failed to save your donation.");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while processing your donation");
    } finally {
      setLoading(false);
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl p-0 max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Fundraiser Info */}
          <div className="bg-blue-50 p-6 md:w-2/5">
            <div className="h-full flex flex-col">
              <DialogHeader className="pb-4">
                <DialogTitle className="text-blue-800">About This Cause</DialogTitle>
              </DialogHeader>
              
              {fundraiser?.coverImage && (
                <div className="mb-4 rounded-md overflow-hidden">
                  <img 
                    src={fundraiser.coverImage} 
                    alt={fundraiser.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              
              <h3 className="text-xl font-semibold text-blue-900 mb-2">{fundraiser?.title}</h3>
              
              <div className="space-y-3 mb-4 flex-grow">
                <p className="text-sm text-blue-800">{fundraiser?.description}</p>
              </div>
              
              <div className="mt-auto">
                <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Started: {new Date(fundraiser?.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="h-3 w-3 mr-1" />
                    <span>Category: {fundraiser?.category || "General"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Donation Form */}
          <div className="p-6 md:w-3/5">
            <DialogHeader>
              <DialogTitle>Donate to {fundraiser?.title}</DialogTitle>
              <DialogDescription>
                Your contribution helps make a difference. All donations are securely processed through Stripe.
              </DialogDescription>
            </DialogHeader>
            
            {success ? (
              <div className="p-4 bg-green-50 rounded-md text-center mt-4">
                <h3 className="text-green-700 font-medium text-lg">Thank You!</h3>
                <p className="text-green-600 mt-2">Your donation was successful.</p>
                <Button className="mt-4" onClick={onClose}>Close</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Donation Amount (₹)
                  </label>
                  
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {donationOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`rounded-md px-3 py-2 text-sm font-medium ${
                          amount === String(option)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                        onClick={() => setAmount(String(option))}
                      >
                        ₹{option}
                      </button>
                    ))}
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Card Details
                  </label>
                  <div className="p-3 border border-gray-300 rounded-md shadow-sm">
                    <CardElement 
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                              color: '#aab7c4',
                            },
                          },
                          invalid: {
                            color: '#9e2146',
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="flex items-center mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-xs text-gray-500">Secure payment processed by Stripe</span>
                  </div>
                </div>
                
                {error && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={!stripe || loading || !amount}
                >
                  <DollarSign className="h-4 w-4 mr-1" />
                  {loading ? "Processing..." : `Donate ₹${amount || "0"}`}
                </Button>
                
                <div className="flex items-center justify-center space-x-3 text-xs text-gray-500 mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Your financial information is encrypted and secure</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

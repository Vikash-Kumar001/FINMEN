import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle, AlertCircle, CreditCard, LogIn, Shield, Lock } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthUtils';

// Load Stripe.js
const loadStripe = async () => {
  if (window.Stripe) {
    return window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');
  }
  
  const script = document.createElement('script');
  script.src = 'https://js.stripe.com/v3/';
  script.async = true;
  return new Promise((resolve, reject) => {
    script.onload = () => {
      resolve(window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''));
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const CheckoutModal = ({ isOpen, onClose, planType, planName, amount, isFirstYear }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('init'); // init, login, payment, success, error
  const [clientSecret, setClientSecret] = useState(null);
  const [stripe, setStripe] = useState(null);
  const [stripeElements, setStripeElements] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [subscriptionId, setSubscriptionId] = useState(null);
  const socket = useSocket();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setStep('init');
      setPaymentError(null);
      setLoading(false);
      
      // Check auth first
      const token = localStorage.getItem("finmen_token");
      if (!token) {
        setStep('login');
        return;
      }
      
      // For free plan, activate immediately
      if (planType === 'free' && amount === 0) {
        activateFreePlan();
        return;
      }
      
      // For paid plans, initialize payment
      if (planType && amount > 0) {
        initializePayment();
      }
    } else {
      // Reset everything when modal closes
      setStep('init');
      setPaymentError(null);
      setClientSecret(null);
      setSubscriptionId(null);
      if (stripeElements) {
        stripeElements.destroy();
        setStripeElements(null);
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (stripeElements) {
        stripeElements.destroy();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (step === 'payment' && stripeElements) {
      // Mount the payment element
      const paymentElement = stripeElements.create('payment');
      paymentElement.mount('#payment-element');
      
      return () => {
        paymentElement.unmount();
      };
    }
  }, [step, stripeElements]);

  useEffect(() => {
    // Listen for real-time payment updates
    if (socket?.socket) {
      const handleSubscriptionActivated = (data) => {
        if (data.subscription && subscriptionId === data.subscription._id) {
          setStep('success');
          toast.success('Subscription activated successfully!');
        }
      };

      socket.socket.on('subscription:activated', handleSubscriptionActivated);

      return () => {
        socket.socket.off('subscription:activated', handleSubscriptionActivated);
      };
    }
  }, [socket, subscriptionId]);

  const activateFreePlan = async () => {
    try {
      setLoading(true);
      setPaymentError(null);

      const response = await api.post('/api/subscription/create-payment', {
        planType: 'free',
      });

      if (response.data.success) {
        setStep('success');
        toast.success('Free plan activated successfully!');
        
        // Emit real-time update
        if (socket?.socket) {
          socket.socket.emit('subscription:activated', {
            subscription: response.data.subscription,
          });
        }
        
        // Close modal after delay
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Failed to activate free plan');
      }
    } catch (error) {
      console.error('Free plan activation error:', error);
      if (error.response?.status === 401) {
        setStep('login');
        setPaymentError('Please login to activate the free plan');
      } else {
        setPaymentError(error.response?.data?.message || error.message || 'Failed to activate free plan');
        setStep('error');
      }
      toast.error(error.response?.data?.message || 'Failed to activate free plan');
    } finally {
      setLoading(false);
    }
  };

  const initializePayment = async () => {
    try {
      setLoading(true);
      setPaymentError(null);

      // Create payment intent
      const response = await api.post('/api/subscription/create-payment', {
        planType,
      });

      if (response.data.success) {
        // For free plan, handle success
        if (planType === 'free') {
          setStep('success');
          toast.success('Free plan activated successfully! 🎉');
          
          // Emit real-time update
          if (socket?.socket) {
            socket.socket.emit('subscription:activated', {
              subscription: response.data.subscription,
            });
          }
          
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 2000);
          return;
        }

        // For paid plans, initialize Stripe
        setClientSecret(response.data.clientSecret);
        setSubscriptionId(response.data.subscriptionId);

        // Initialize Stripe
        const stripeInstance = await loadStripe();
        setStripe(stripeInstance);

        // Create elements
        const elements = stripeInstance.elements({
          clientSecret: response.data.clientSecret,
          appearance: {
            theme: 'stripe',
          },
        });

        setStripeElements(elements);
        setStep('payment');
      } else {
        throw new Error(response.data.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      if (error.response?.status === 401) {
        setStep('login');
        setPaymentError('Please login to continue');
      } else {
        setPaymentError(error.response?.data?.message || error.message || 'Failed to initialize payment');
        setStep('error');
      }
      toast.error(error.response?.data?.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !stripeElements || !clientSecret) {
      return;
    }

    setLoading(true);
    setPaymentError(null);

    try {
      // Confirm payment
      const { error: submitError } = await stripeElements.submit();
      
      if (submitError) {
        setPaymentError(submitError.message);
        setLoading(false);
        return;
      }

      // Confirm payment intent
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements: stripeElements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/subscription-success`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        setPaymentError(confirmError.message);
        setLoading(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Verify payment on backend and activate subscription
        try {
          const verifyResponse = await api.post('/api/subscription/verify-payment', {
            subscriptionId,
            paymentIntentId: paymentIntent.id,
          });

          if (verifyResponse.data.success) {
            setStep('success');
            toast.success('Payment successful! Your subscription has been activated. 🎉');
            
            // Emit real-time update via socket
            if (socket?.socket) {
              socket.socket.emit('subscription:activated', {
                subscription: verifyResponse.data.subscription,
              });
            }
            
            // Close modal after a delay and refresh
            setTimeout(() => {
              onClose();
              // Refresh the page to show updated subscription
              window.location.reload();
            }, 2500);
          } else {
            throw new Error(verifyResponse.data.message || 'Failed to activate subscription');
          }
        } catch (verifyError) {
          console.error('Subscription activation error:', verifyError);
          setPaymentError(verifyError.response?.data?.message || 'Payment succeeded but failed to activate subscription. Please contact support.');
          toast.error('Payment succeeded but subscription activation failed. Please contact support.');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(error.response?.data?.message || error.message || 'Payment failed');
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Complete Payment</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-600 font-semibold">Secure Payment • SSL Encrypted</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Plan Info - Only show if not in login step */}
            {step !== 'login' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-lg text-gray-900">{planName}</h3>
                  {amount > 0 && (
                    <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full font-bold">
                      {isFirstYear ? 'First Year' : 'Renewal'}
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-purple-600">₹{amount.toLocaleString()}</span>
                  {amount > 0 && <span className="text-gray-600 font-semibold">/year</span>}
                </div>
                {amount === 0 && (
                  <p className="text-sm text-gray-600 mt-2">Free plan - No payment required</p>
                )}
              </motion.div>
            )}

            {/* Payment Form */}
            {step === 'init' && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              </div>
            )}

            {step === 'login' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogIn className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Login Required</h3>
                <p className="text-gray-600 mb-6">
                  Please login to {amount === 0 ? 'activate' : 'subscribe to'} this plan
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      localStorage.setItem('pending_subscription', JSON.stringify({ planType, planName, amount, isFirstYear }));
                      navigate('/login', { state: { from: 'pricing', planType } });
                    }}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-5 h-5" />
                    Go to Login
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-bold text-gray-700">
                      Payment Details
                    </label>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Shield className="w-3 h-3" />
                      <span>Secured by Stripe</span>
                    </div>
                  </div>
                  <div id="payment-element" className="p-4 border-2 border-gray-200 rounded-lg min-h-[200px] bg-gray-50">
                    {/* Stripe Elements will mount here */}
                  </div>
                  {paymentError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{paymentError}</span>
                    </motion.div>
                  )}
                  
                  {/* Security Badges */}
                  <div className="flex items-center gap-4 pt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-green-600" />
                      <span>256-bit SSL</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-blue-600" />
                      <span>PCI Compliant</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-black hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Pay ₹{amount.toLocaleString()}
                    </>
                  )}
                </button>
                
                <p className="text-xs text-center text-gray-500">
                  By proceeding, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>
            )}

            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Payment Successful! 🎉</h3>
                <p className="text-gray-600 mb-4">Your subscription has been activated successfully.</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-green-800 font-semibold">
                    You now have access to all premium features!
                  </p>
                </div>
                <p className="text-xs text-gray-500">Redirecting to your dashboard...</p>
              </motion.div>
            )}

            {step === 'error' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Failed</h3>
                <p className="text-gray-600 mb-4">{paymentError}</p>
                <button
                  onClick={initializePayment}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Try Again
                </button>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CheckoutModal;


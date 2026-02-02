"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CreditCard, Truck, MapPin, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createOrderServer } from '@/lib/actions';
import { toast } from 'sonner';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';

const CheckoutPage = () => {
  const [selectedPayment, setSelectedPayment] = useState('visa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    district: '',
    village: '',
    cell: '',
    phoneNumber: '',
    notes: ''
  });
  const [paymentFields, setPaymentFields] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    mobilePhone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const { items: cartItems, totalPrice, clearCart } = useCart();
  const { user, isLoading: authLoading } = useAuth();

  const subtotal = totalPrice;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  // Redirect to login if not authenticated (only after auth check is complete)
  React.useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please log in to checkout');
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Redirect to cart if empty
  React.useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems.length, router]);

  const paymentMethods = [
    {
      id: 'visa',
      name: 'Visa',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg',
      alt: 'Visa logo'
    },
    {
      id: 'mastercard',
      name: 'Mastercard',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
      alt: 'Mastercard logo'
    },
    {
      id: 'mtn',
      name: 'MTN MoMo',
      logo: 'https://iconape.com/wp-content/files/uf/184242/svg/184242.svg',
      alt: 'MTN MoMo logo'
    },
    {
      id: 'airtel',
      name: 'Airtel Money',
      logo: 'https://lwsc.com.zm/assets/img/payment-methods/1.jpg',
      alt: 'Airtel Money logo'
    },
  ];

  const validatePhoneNumber = (phone: string) => {
    // Rwanda phone number validation (basic)
    const phoneRegex = /^(\+250|0)?[7-9]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-numeric characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    // Add spaces for readability
    if (cleaned.startsWith('+250')) {
      return cleaned.replace(/(\+250)(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
    } else if (cleaned.startsWith('0')) {
      return cleaned.replace(/(0)(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
    }
    return cleaned;
  };

  const handleDeliveryChange = (field: string, value: string) => {
    if (field === 'phoneNumber') {
      value = formatPhoneNumber(value);
    }
    setDeliveryAddress(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePaymentChange = (field: string, value: string) => {
    if (field === 'mobilePhone') {
      value = formatPhoneNumber(value);
    }
    setPaymentFields(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateCardNumber = (cardNumber: string) => {
    // Basic card number validation (16 digits)
    const cardRegex = /^\d{16}$/;
    return cardRegex.test(cardNumber.replace(/\s/g, ''));
  };

  const validateExpiryDate = (expiry: string) => {
    // MM/YY format validation
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiry)) return false;

    const [month, year] = expiry.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expYear = parseInt(year);
    const expMonth = parseInt(month);

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return false;
    }
    return true;
  };

  const validateCVV = (cvv: string) => {
    // 3-4 digits
    const cvvRegex = /^\d{3,4}$/;
    return cvvRegex.test(cvv);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Delivery validation
    if (!deliveryAddress.village.trim()) {
      newErrors.village = 'Village is required';
    }
    if (!deliveryAddress.cell.trim()) {
      newErrors.cell = 'Cell is required';
    }
    if (!deliveryAddress.district.trim()) {
      newErrors.district = 'District is required';
    }
    if (!deliveryAddress.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!validatePhoneNumber(deliveryAddress.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid Rwandan phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user) {
      toast.error('Please log in to place an order');
      router.push('/login');
      return;
    }

    console.log('🧑 User object:', user);
    console.log('🆔 User ID:', user.id);
    console.log('📧 User email:', user.email);

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      router.push('/cart');
      return;
    }

    setIsProcessing(true);

    try {
      const orderId = await createOrderServer({
        userId: user.id,
        status: 'pending',
        deliveryAddress: {
          district: deliveryAddress.district,
          village: deliveryAddress.village,
          cell: deliveryAddress.cell,
          phone: deliveryAddress.phoneNumber,
          notes: deliveryAddress.notes || undefined,
        },
        items: cartItems.map(item => ({
          product_id: item.product_id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      // Clear cart after successful order
      clearCart();
      toast.success('Order placed successfully!');

      // Redirect after a short delay to let the user see the success message
      setTimeout(() => {
        router.push(`/orders/${orderId}`);
      }, 1500);
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 text-center mb-8"
        >
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
              <div className="flex items-center mb-4">
                <MapPin className="w-6 h-6 text-[#004990] mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Delivery Address</h2>
              </div>
              <div className="space-y-4">
                {/* User Email Display */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="w-full px-4 py-3 border rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                  <p className="text-gray-500 text-xs mt-1">Used for order confirmation and updates</p>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Village *"
                    value={deliveryAddress.village}
                    onChange={(e) => handleDeliveryChange('village', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004990] transition-all ${
                      errors.village ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.village && (
                    <p className="text-red-500 text-sm mt-1">{errors.village}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Cell *"
                    value={deliveryAddress.cell}
                    onChange={(e) => handleDeliveryChange('cell', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004990] transition-all ${
                      errors.cell ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.cell && (
                    <p className="text-red-500 text-sm mt-1">{errors.cell}</p>
                  )}
                </div>

                <div>
                  <select
                    value={deliveryAddress.district}
                    onChange={(e) => handleDeliveryChange('district', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004990] transition-all ${
                      errors.district ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select District *</option>
                    <optgroup label="City of Kigali">
                      <option value="Gasabo">Gasabo</option>
                      <option value="Kicukiro">Kicukiro</option>
                      <option value="Nyarugenge">Nyarugenge</option>
                    </optgroup>
                    <optgroup label="Eastern Province">
                      <option value="Bugesera">Bugesera</option>
                      <option value="Gatsibo">Gatsibo</option>
                      <option value="Kayonza">Kayonza</option>
                      <option value="Kirehe">Kirehe</option>
                      <option value="Ngoma">Ngoma</option>
                      <option value="Nyagatare">Nyagatare</option>
                      <option value="Rwamagana">Rwamagana</option>
                    </optgroup>
                    <optgroup label="Northern Province">
                      <option value="Burera">Burera</option>
                      <option value="Gakenke">Gakenke</option>
                      <option value="Gicumbi">Gicumbi</option>
                      <option value="Musanze">Musanze</option>
                      <option value="Rulindo">Rulindo</option>
                    </optgroup>
                    <optgroup label="Southern Province">
                      <option value="Gisagara">Gisagara</option>
                      <option value="Huye">Huye</option>
                      <option value="Kamonyi">Kamonyi</option>
                      <option value="Muhanga">Muhanga</option>
                      <option value="Nyamagabe">Nyamagabe</option>
                      <option value="Nyanza">Nyanza</option>
                      <option value="Nyaruguru">Nyaruguru</option>
                      <option value="Ruhango">Ruhango</option>
                    </optgroup>
                    <optgroup label="Western Province">
                      <option value="Karongi">Karongi</option>
                      <option value="Ngororero">Ngororero</option>
                      <option value="Nyabihu">Nyabihu</option>
                      <option value="Nyamasheke">Nyamasheke</option>
                      <option value="Rubavu">Rubavu</option>
                      <option value="Rusizi">Rusizi</option>
                      <option value="Rutsiro">Rutsiro</option>
                    </optgroup>
                  </select>
                  {errors.district && (
                    <p className="text-red-500 text-sm mt-1">{errors.district}</p>
                  )}
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number (e.g., +250 78/79/72/73 8123456) *"
                    value={deliveryAddress.phoneNumber}
                    onChange={(e) => handleDeliveryChange('phoneNumber', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004990] transition-all ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">Enter a valid Rwandan phone number for delivery updates</p>
                </div>

                <div>
                  <textarea
                    placeholder="Delivery notes (optional)"
                    value={deliveryAddress.notes}
                    onChange={(e) => handleDeliveryChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004990] transition-all border-gray-300"
                  />
                  <p className="text-gray-500 text-xs mt-1">Any special instructions for delivery</p>
                </div>
              </div>
            </div>

            {/* Payment Methods - commented out for later use */}
            {false && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100"
            >
              <div className="flex items-center mb-6">
                <CreditCard className="w-6 h-6 text-[#004990] mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Payment Method</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {paymentMethods.map((method) => (
                  <motion.button
                    key={method.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`relative p-4 border-2 rounded-xl transition-all duration-300 ${
                      selectedPayment === method.id
                        ? 'border-[#004990] bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <Image
                      src={method.logo}
                      alt={method.alt}
                      width={method.id === 'airtel' ? 80 : 60}
                      height={method.id === 'airtel' ? 50 : 40}
                      className="object-contain mx-auto"
                    />
                    {selectedPayment === method.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-[#004990] rounded-full flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Payment Form - Conditional based on selected method */}
              <motion.div
                key={selectedPayment}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {(selectedPayment === 'visa' || selectedPayment === 'mastercard') && (
                  <>
                    <div>
                      <input
                        type="text"
                        placeholder="Card Number (16 digits)"
                        value={paymentFields.cardNumber}
                        onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004990] transition-all ${
                          errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        maxLength={19}
                      />
                      {errors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={paymentFields.expiryDate}
                          onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004990] transition-all ${
                            errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                          }`}
                          maxLength={5}
                        />
                        {errors.expiryDate && (
                          <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="CVV"
                          value={paymentFields.cvv}
                          onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004990] transition-all ${
                            errors.cvv ? 'border-red-500' : 'border-gray-300'
                          }`}
                          maxLength={4}
                        />
                        {errors.cvv && (
                          <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {(selectedPayment === 'mtn' || selectedPayment === 'airtel') && (
                  <div>
                    <input
                      type="tel"
                      placeholder="Mobile Phone Number (e.g., +250 78/79/72/73 8123456)"
                      value={paymentFields.mobilePhone}
                      onChange={(e) => handlePaymentChange('mobilePhone', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004990] transition-all ${
                        errors.mobilePhone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.mobilePhone && (
                      <p className="text-red-500 text-sm mt-1">{errors.mobilePhone}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                      Enter your {selectedPayment === 'mtn' ? 'MTN' : 'Airtel'} registered mobile number
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
            )}
          </motion.div>

          {/* Right Column - Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 sticky top-4">
              <div className="flex items-center mb-6">
                <Truck className="w-6 h-6 text-[#004990] mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
              </div>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden w-8 h-8 bg-gray-300 rounded"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-[#004990]">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#004990]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Pay Now Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full mt-6 bg-[#004990] text-white py-4 px-6 rounded-xl font-semibold hover:bg-[#003d73] focus:outline-none focus:ring-2 focus:ring-[#004990] focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing Payment...
                  </div>
                ) : (
                  `Pay Now - $${total.toFixed(2)}`
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
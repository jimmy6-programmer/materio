import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';

const steps = [
  { label: 'Order Placed', status: 'placed' },
  { label: 'Confirmed', status: 'confirmed' },
  { label: 'Processing', status: 'processing' },
  { label: 'Shipped', status: 'shipped' },
  { label: 'Out for Delivery', status: 'out_for_delivery' },
  { label: 'Delivered', status: 'delivered' },
];

const statusToStep = {
  Pending: 0,
  Processing: 2,
  Shipped: 3,
  Delivered: 5,
  Cancelled: -1, // special case
};

interface OrderProgressTrackerProps {
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  imageUrl?: string;
  productName?: string;
}

export function OrderProgressTracker({ status, imageUrl, productName }: OrderProgressTrackerProps) {
  const currentStep = statusToStep[status];
  const isCancelled = status === 'Cancelled';

  return (
    <div className="w-full py-8">
      {/* Centered product thumbnail on the progress line */}
      {imageUrl && (
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 -mt-10 z-20">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={productName || 'Product'} className="w-full h-full object-cover" />
          </div>
        </div>
      )}
      {/* mobile thumbnail above the steps */}
      {imageUrl && (
        <div className="md:hidden flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={productName || 'Product'} className="w-full h-full object-cover" />
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between relative">
        {/* Desktop Progress line */}
        <motion.div
          className="hidden md:block absolute top-5 left-0 h-0.5 bg-gray-200 w-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isCancelled ? 0.2 : (currentStep >= 0 ? (currentStep / (steps.length - 1)) : 0) }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{ originX: 0 }}
        />
        <motion.div
          className={`hidden md:block absolute top-5 left-0 h-0.5 w-full ${isCancelled ? 'bg-red-500' : 'bg-blue-500'}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isCancelled ? 0.2 : (currentStep >= 0 ? (currentStep / (steps.length - 1)) : 0) }}
          transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
          style={{ originX: 0 }}
        />

        {/* Mobile Progress line */}
        <motion.div
          className="md:hidden absolute left-1/2 top-0 h-full w-0.5 bg-gray-200 transform -translate-x-1/2"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: isCancelled ? 0.2 : (currentStep >= 0 ? (currentStep / (steps.length - 1)) : 0) }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{ originY: 0 }}
        />
        <motion.div
          className={`md:hidden absolute left-1/2 top-0 h-full w-0.5 ${isCancelled ? 'bg-red-500' : 'bg-blue-500'} transform -translate-x-1/2`}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: isCancelled ? 0.2 : (currentStep >= 0 ? (currentStep / (steps.length - 1)) : 0) }}
          transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
          style={{ originY: 0 }}
        />

        {steps.map((step, index) => {
          const isCompleted = isCancelled ? index === 0 : index <= currentStep;
          const isCurrent = isCancelled ? false : index === currentStep;

          return (
            <div key={step.status} className="flex flex-col items-center relative z-10 mb-8 md:mb-0 last:mb-0">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  isCompleted
                    ? `${isCancelled ? 'bg-red-500 border-red-500' : 'bg-blue-500 border-blue-500'} text-white`
                    : 'bg-white border-gray-300 text-gray-400'
                } ${isCurrent ? `ring-4 ${isCancelled ? 'ring-red-100' : 'ring-blue-100'}` : ''}`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className={`mt-2 text-xs font-medium text-center max-w-20 ${
                  isCompleted ? (isCancelled ? 'text-red-600' : 'text-blue-600') : 'text-gray-500'
                }`}
              >
                {isCancelled && index === 0 ? 'Cancelled' : step.label}
              </motion.p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
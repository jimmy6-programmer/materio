"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OrderProgressTracker } from '@/components/orders/OrderProgressTracker';
import {
  ArrowLeft,
  Copy,
  Download,
  MessageCircle,
  MapPin,
  CreditCard,
  Package,
  AlertTriangle
} from 'lucide-react';
import { OrderWithItems, getOrderById } from '@/lib/queries/orders';

// Placeholder Lottie for status - replace with actual
const statusAnimationData = {};

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const orderData = await getOrderById(id);
        if (!orderData) throw new Error('Order not found');
        setOrder(orderData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const handleCopyOrderId = () => {
    if (!order?.id) return;
    navigator.clipboard.writeText(order.id);
    // Could show toast notification
  };

  const handleDownloadInvoice = () => {
    // Implement download logic
    if (!order?.id) return;
    console.log('Download invoice for', order.id);
  };

  const handleContactSupport = () => {
    // Implement contact support
    console.log('Contact support for', order?.id);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist.'}</p>
          <Button onClick={() => router.push('/orders')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date'
    const d = new Date(dateString)
    if (Number.isNaN(d.getTime())) return 'Unknown date'
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Button
          variant="ghost"
          onClick={() => router.push('/orders')}
          className="group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Orders
        </Button>
      </motion.div>

      {/* Order Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Order {order.id.slice(0, 8)}</CardTitle>
                <p className="text-gray-600 mt-1">Placed on {formatDate(order.created_at)}</p>
              </div>
              <Badge
                className={`${
                  order.status === 'delivered'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                } border-0 capitalize`}
              >
                {order.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
              <Button variant="outline" size="sm" className="w-full md:w-auto" onClick={handleCopyOrderId}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Order ID
              </Button>
              <Button variant="outline" size="sm" className="w-full md:w-auto" onClick={handleDownloadInvoice}>
                <Download className="mr-2 h-4 w-4" />
                Download Invoice
              </Button>
              <Button variant="outline" size="sm" className="w-full md:w-auto" onClick={handleContactSupport}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card>
          <CardContent className="pt-6">
            {(() => {
              const firstItem = order.order_items?.[0] ?? null;
              const imageUrl: string | undefined = firstItem?.product_image || firstItem?.product?.image || firstItem?.product?.images?.[0];
              const productName: string | undefined = firstItem?.product_name || firstItem?.product?.name;
              return (
                <OrderProgressTracker
                  status={order.status ? (order.status.charAt(0).toUpperCase() + order.status.slice(1) as any) : ('Unknown' as any)}
                  imageUrl={imageUrl}
                  productName={productName}
                />
              );
            })()}
          </CardContent>
        </Card>
      </motion.div>


      <div className="grid gap-8 lg:grid-cols-2">
        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.order_items?.map((item) => {
                const imageSrc: string | undefined = item.product_image || item.product?.image || (item.product?.images && item.product.images[0]);
                return (
                  <div key={item.id} className="flex items-center gap-4">
                    {/** Product image: prefer common fields `product_image`, `image`, or nested `product?.image`/`product?.images[0]` */}
                    <div className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden bg-gray-100 relative">
                      {imageSrc ? (
                        <Image
                          src={imageSrc as string}
                          alt={item.product_name || 'Product image'}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                          No Image
                        </div>
                      )}
                    </div>

                  <div className="flex-1">
                    <h4 className="font-medium">
                      {item.product_name || item.product?.name || `Product ${item.product_id?.slice?.(0, 8) || '—'}`}
                    </h4>
                    <p className="text-sm text-gray-600">Qty: {item.quantity ?? 0}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${((item.price ?? 0)).toFixed(2)}</p>
                  </div>
                </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Delivery & Payment */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <p><strong>District:</strong> {order.delivery_address.district}</p>
                <p><strong>Village:</strong> {order.delivery_address.village}</p>
                <p><strong>Cell:</strong> {order.delivery_address.cell}</p>
                <p><strong>Phone:</strong> {order.delivery_address.phone}</p>
                {order.delivery_address.notes && (
                  <p><strong>Notes:</strong> {order.delivery_address.notes}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${order.total_price.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
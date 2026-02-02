import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface Order {
  id: string;
  date: string;
  total: number;
  items: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

interface OrderCardProps {
  order: Order;
  onViewDetails: (id: string) => void;
}

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
              <p className="text-sm text-gray-600">{order.date}</p>
            </div>
            <Badge className={`${statusColors[order.status]} border-0`}>
              {order.status}
            </Badge>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{order.items} items</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              ${order.total.toFixed(2)}
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full group"
            onClick={() => onViewDetails(order.id)}
          >
            View Details
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
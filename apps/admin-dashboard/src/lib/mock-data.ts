export const stats = [
  { label: "Total Revenue", value: "$45,231.89", change: "+20.1% from last month", icon: "DollarSign" },
  { label: "Orders", value: "+2350", change: "+180.1% from last month", icon: "ShoppingCart" },
  { label: "Sales", value: "+12,234", change: "+19% from last month", icon: "CreditCard" },
  { label: "Active Now", value: "+573", change: "+201 since last hour", icon: "Activity" },
];

export const revenueData = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 2100 },
  { name: "Mar", total: 1800 },
  { name: "Apr", total: 2400 },
  { name: "May", total: 3200 },
  { name: "Jun", total: 2800 },
  { name: "Jul", total: 3600 },
  { name: "Aug", total: 4100 },
  { name: "Sep", total: 3800 },
  { name: "Oct", total: 4500 },
  { name: "Nov", total: 5200 },
  { name: "Dec", total: 6100 },
];

export const recentOrders = [
  { id: "ORD001", customer: "Liam Johnson", email: "liam@example.com", status: "Delivered", amount: "$250.00", date: "2023-10-01" },
  { id: "ORD002", customer: "Olivia Smith", email: "olivia@example.com", status: "Processing", amount: "$150.00", date: "2023-10-02" },
  { id: "ORD003", customer: "Noah Williams", email: "noah@example.com", status: "Shipped", amount: "$350.00", date: "2023-10-03" },
  { id: "ORD004", customer: "Emma Brown", email: "emma@example.com", status: "Pending", amount: "$450.00", date: "2023-10-04" },
  { id: "ORD005", customer: "Ava Jones", email: "ava@example.com", status: "Cancelled", amount: "$550.00", date: "2023-10-05" },
];

export const products = [
  { id: "PROD001", name: "Wireless Headphones", category: "Electronics", price: 199.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop" },
  { id: "PROD002", name: "Leather Wallet", category: "Accessories", price: 49.99, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&h=300&fit=crop" },
  { id: "PROD003", name: "Smart Watch", category: "Electronics", price: 299.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop" },
  { id: "PROD004", name: "Running Shoes", category: "Footwear", price: 129.99, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop" },
  { id: "PROD005", name: "Coffee Mug", category: "Kitchenware", price: 14.99, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&h=300&fit=crop" },
];

export const categories = [
  { id: "CAT001", name: "Electronics", description: "Gadgets and tech" },
  { id: "CAT002", name: "Accessories", description: "Fashion accessories" },
  { id: "CAT003", name: "Footwear", description: "Shoes and more" },
  { id: "CAT004", name: "Kitchenware", description: "Cooking and dining" },
];

export const inquiries = [
  { id: "INQ001", name: "Alice Cooper", email: "alice@example.com", subject: "Order Status", message: "When will my order arrive?", date: "2023-10-10", status: "unread" },
  { id: "INQ002", name: "Bob Dylan", email: "bob@example.com", subject: "Refund Request", message: "I want to return my item.", date: "2023-10-11", status: "read" },
];

export const announcements = [
  { id: "ANN001", title: "Winter Sale", content: "Get 50% off on all winter collection!", date: "2023-11-01", active: true },
  { id: "ANN002", title: "New Arrivals", content: "Check out our latest arrivals now!", date: "2023-11-05", active: true },
];

export const articles = [
  { id: "ART001", title: "Top 10 Gadgets of 2023", description: "A comprehensive guide to the best gadgets of 2023", content: "Gadgets are getting better...", date: "2023-10-15", status: "published", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=300&fit=crop" },
  { id: "ART002", title: "How to Style Your Home", description: "Essential tips for modern interior design", content: "Interior design tips...", date: "2023-10-20", status: "draft", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop" },
];

export const users = [
  { id: "USR001", fullName: "John Doe", email: "john.doe@example.com", phone: "+1-555-123-4567", status: "active", createdAt: "2023-09-01" },
  { id: "USR002", fullName: "Jane Smith", email: "jane.smith@example.com", phone: "+1-555-234-5678", status: "active", createdAt: "2023-09-05" },
  { id: "USR003", fullName: "Bob Johnson", email: "bob.johnson@example.com", phone: "+1-555-345-6789", status: "disabled", createdAt: "2023-09-10" },
  { id: "USR004", fullName: "Alice Brown", email: "alice.brown@example.com", phone: "+1-555-456-7890", status: "active", createdAt: "2023-09-15" },
  { id: "USR005", fullName: "Charlie Wilson", email: "charlie.wilson@example.com", phone: "+1-555-567-8901", status: "active", createdAt: "2023-09-20" },
];

export const orderItems = [
  { id: "OI001", order_id: "ORD001", product_name: "Wireless Headphones", quantity: 1, price: 199.99 },
  { id: "OI002", order_id: "ORD001", product_name: "Leather Wallet", quantity: 2, price: 49.99 },
  { id: "OI003", order_id: "ORD002", product_name: "Smart Watch", quantity: 1, price: 299.99 },
  { id: "OI004", order_id: "ORD003", product_name: "Running Shoes", quantity: 1, price: 129.99 },
  { id: "OI005", order_id: "ORD003", product_name: "Coffee Mug", quantity: 3, price: 14.99 },
  { id: "OI006", order_id: "ORD004", product_name: "Wireless Headphones", quantity: 2, price: 199.99 },
  { id: "OI007", order_id: "ORD005", product_name: "Leather Wallet", quantity: 1, price: 49.99 },
];

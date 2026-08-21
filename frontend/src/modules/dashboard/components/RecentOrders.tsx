import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import laptopImage from "@/assets/images/products/product-01.jpg";
import smartPhoneImage from "@/assets/images/products/product-03.jpg";
import smartWatchImage from "@/assets/images/products/product-02.jpg";

interface Order {
  product: string;
  img: string;
  category: string;
  price: string;
  status: "Delivered" | "Pending" | "Cancelled";
}

const orders: Order[] = [
  {
    product: "MacBook Pro 13”",
    img: laptopImage,
    category: "Laptop",
    price: "$2399.00",
    status: "Delivered",
  },
  {
    product: "Apple Watch Ultra",
    img: smartWatchImage,
    category: "Smartwatch",
    price: "$699.00",
    status: "Pending",
  },
  {
    product: "iPhone 15 Pro Max",
    img: smartPhoneImage,
    category: "Smartphone",
    price: "$1869.00",
    status: "Delivered",
  },
  {
    product: "Apple Watch Ultra",
    img: smartWatchImage,
    category: "Smartwatch",
    price: "$699.00",
    status: "Cancelled",
  },
];

export const RecentOrders = () => {
  return (
    <Card className="rounded-2xl border border-gray-200 p-6 bg-white dark:border-gray-800 dark:bg-white/3">
      <CardHeader className="flex flex-row items-start justify-between p-0 space-y-0">
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent className="p-0 mt-4 space-y-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="p-0">Products</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="p-0 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium py-3 px-0">
                  <div className="flex items-center gap-2">
                    <img
                      src={order.img}
                      alt={order.product}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                    {order.product}
                  </div>
                </TableCell>
                <TableCell className="py-3 px-2">{order.category}</TableCell>
                <TableCell className="py-3 px-2">{order.price}</TableCell>
                <TableCell className="py-3 px-0 text-right">
                  <span
                    className={`border rounded-lg px-2 py-1 text-xs font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 border-green-200 text-green-600"
                        : order.status === "Pending"
                          ? "bg-yellow-100 border-yellow-200 text-yellow-600"
                          : "bg-red-100 border-red-200 text-red-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

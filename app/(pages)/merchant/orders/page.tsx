"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/app/context/SearchContext";

interface Order {
  store_name: string;
  store_id: string; 
  address: string;
  location: string;
  phone: string;
  order_date: string;
  amount: number;
  order_list: Array<{
    item_image: string;
    item_name: string;
    item_quantity: number;
  }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();
  const { searchTerm } = useSearch();

  useEffect(() => {
    fetch("/ordersData.json")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching orders data:", error));
  }, []);

  const filteredOrders = orders.filter((order) =>
    order.store_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Ирсэн захиалга</h1>
      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          Хайлтын үр дүн олдсонгүй
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredOrders.map((order, index) => (
            <div
              key={index}
              className="bg-white border-black border rounded-xl p-8 flex flex-col items-start text-start"
            >
              <p className="text-sm sm:text-lg mb-2">Байгууллагын нэр: {order.store_name}</p>
              <p className="text-sm sm:text-lg mb-2">Хаяг: {order.address}</p>
              <p className="text-sm sm:text-lg mb-2">Байршил: {order.location}</p>
              <p className="text-sm sm:text-lg mb-4">Утас: {order.phone}</p>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-[#41FF1B] text-white px-5 py-2 rounded-full hover:bg-green-500 transition-all duration-300"
                  onClick={() => router.push(`/merchant/orders/${order.store_id}`)} 
                >
                  Шалгах
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

interface Order {
  store_name: string;
  store_id: string;
  address: string;
  location: string;
  order_date: string;
  amount: number;
  order_list: Array<{
    item_image: string;
    item_name: string;
    item_quantity: number;
    item_price: number;
  }>;
  status: string;
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const orderId = Array.isArray(id) ? id[0] : id;

      fetch("/ordersData.json")
        .then((res) => res.json())
        .then((data) => {
          const foundOrder = data.find(
            (order: Order) => order.store_id === orderId
          );
          setOrder(foundOrder || null);
        })
        .catch((error) => console.error("Error fetching order data:", error));
    }
  }, [id]);

  if (!order) {
    return <div>Loading order details...</div>;
  }

  const handleConfirm = () => {
    if (order) {
      setOrder({ ...order, status: "Батлагдсан" });
      toast.success("Амжилттай!");
    }
  };

  const handleCancel = () => {
    if (order) {
      setOrder({ ...order, status: "Цуцлагдсан" });
      toast.error("Цуцлагдсан");
    }
  };

  const totalAmount = order.order_list.reduce((acc, item) => {
    return acc + item.item_quantity * item.item_price;
  }, 0);

  return (
    <div className="px-6 py-8">
        <Toaster position="top-center" />
      <h1 className="text-3xl font-bold text-center mb-8">
        Захиалгын дэлгэрэнгүй
      </h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/8 p-8 bg-white border-black border rounded-xl flex flex-col justify-between">
          <h2 className="text-xl font-semibold mb-4">Захиалгын мэдээлэл</h2>
          <div>
            <p>
              <strong>Хаяг:</strong> {order.address}
            </p>
            <p>
              <strong>Байршил:</strong> {order.location}
            </p>
            <p>
              <strong>Хугацаа:</strong> {order.order_date}
            </p>
            <p>
              <strong>Нийт дүн:</strong> {totalAmount}₮
            </p>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              className="px-4 py-2 bg-[#41FF1B] text-white rounded-full hover:bg-green-600 transition"
              onClick={handleConfirm}
            >
              Батлах
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
              onClick={handleCancel}
            >
              Цуцлах
            </button>
          </div>
        </div>

        {/* Right Section: Order Items */}
        <div className="w-full lg:w-5/8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {order.order_list.map((item, index) => (
            <div
              key={index}
              className="bg-white border-black border rounded-xl p-4 flex flex-col items-center transition hover:shadow-xl"
            >
              <Image
                src={item.item_image}
                alt={item.item_name}
                width={100}
                height={100}
                className="rounded-xl object-cover mb-4"
              />
              <p className="text-sm sm:text-lg font-semibold">
                {item.item_name}
              </p>
              <p className="text-sm sm:text-lg">
                Тоо ширхэг: {item.item_quantity}
              </p>
              <p className="text-sm sm:text-lg">Үнэ: {item.item_price}₮</p>
              <p className="text-sm sm:text-lg">
                Дүн: {item.item_quantity * item.item_price}₮
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

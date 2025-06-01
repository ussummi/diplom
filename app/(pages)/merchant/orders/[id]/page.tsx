"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

interface DeliveryInfo {
  startDate: string;
  receiveDate: string;
}

interface Item {
  item_image: string;
  item_name: string;
  item_quantity: number;
  item_price: number;
}

interface Order {
  store_name: string;
  store_id: string;
  address: string;
  location: string;
  order_date: string;
  amount: number;
  order_list: Item[];
  status: string;
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    startDate: "",
    receiveDate: "",
  });
  const [doneItems, setDoneItems] = useState<{ [key: number]: boolean }>({});

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

          const savedDelivery = localStorage.getItem(`delivery-${orderId}`);
          if (savedDelivery) {
            setDeliveryInfo(JSON.parse(savedDelivery));
          }

          const savedDone = localStorage.getItem(`done-items-${orderId}`);
          if (savedDone) {
            setDoneItems(JSON.parse(savedDone));
          }
        });
    }
  }, [id]);

  const handleConfirm = () => {
    if (!deliveryInfo.startDate || !deliveryInfo.receiveDate) {
      toast.error("Огноог бөглөнө үү");
      return;
    }

    const updatedOrder = { ...order!, status: "Хүргэлтэнд гарсан" };
    setOrder(updatedOrder);
    localStorage.setItem(
      `delivery-${order!.store_id}`,
      JSON.stringify(deliveryInfo)
    );
    toast.success("Захиалга батлагдлаа. Хүргэлтэнд гарсан");
  };

  const handleCancel = () => {
    setOrder({ ...order!, status: "Цуцлагдсан" });
    toast.error("Захиалга цуцлагдсан");
  };

  const handleItemDone = (index: number) => {
    const updatedDone = { ...doneItems, [index]: true };
    setDoneItems(updatedDone);
    localStorage.setItem(
      `done-items-${order!.store_id}`,
      JSON.stringify(updatedDone)
    );
  };

  if (!order) return <div>Loading order details...</div>;

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
            <p><strong>Хаяг:</strong> {order.address}</p>
            <p><strong>Байршил:</strong> {order.location}</p>
            <p><strong>Хугацаа:</strong> {order.order_date}</p>
            <p><strong>Нийт дүн:</strong> {totalAmount}₮</p>
          </div>

          {order.status === "Хүргэлтэнд гарсан" ? (
            <div className="mt-6 text-green-600 font-semibold">
              Захиалга батлагдлаа. Хүргэлтэнд гарсан
              <div className="text-sm mt-2 text-black">
                <p>Гарсан огноо: {deliveryInfo.startDate}</p>
                <p>Хүлээн авах огноо: {deliveryInfo.receiveDate}</p>
              </div>
            </div>
          ) : order.status === "Цуцлагдсан" ? (
            <p className="mt-6 text-red-600 font-semibold">Захиалга цуцлагдсан</p>
          ) : (
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Хүргэлтэнд гарах огноо</label>
                <input
                  type="date"
                  value={deliveryInfo.startDate}
                  onChange={(e) =>
                    setDeliveryInfo({ ...deliveryInfo, startDate: e.target.value })
                  }
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Хүлээн авах огноо</label>
                <input
                  type="date"
                  value={deliveryInfo.receiveDate}
                  onChange={(e) =>
                    setDeliveryInfo({ ...deliveryInfo, receiveDate: e.target.value })
                  }
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex gap-4 mt-4">
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
          )}
        </div>

        <div className="w-full lg:w-5/8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {order.order_list.map((item, index) => {
            const isDone = doneItems[index];
            return (
              <div
                key={index}
                className={`bg-white ${
                  isDone ? "border-green-500" : "border-black"
                } border rounded-xl p-4 flex flex-col items-center transition hover:shadow-xl max-h-[300px] overflow-hidden`}
              >
                <Image
                  src={item.item_image}
                  alt={item.item_name}
                  width={100}
                  height={100}
                  className="rounded-xl object-cover mb-4"
                />
                <p className="text-sm sm:text-lg font-semibold text-center">{item.item_name}</p>
                <p className="text-sm sm:text-lg">Тоо ширхэг: {item.item_quantity}</p>
                <p className="text-sm sm:text-lg">Үнэ: {item.item_price}₮</p>
                <p className="text-sm sm:text-lg">
                  Дүн: {item.item_quantity * item.item_price}₮
                </p>

                {!isDone ? (
                  <button
                    onClick={() => handleItemDone(index)}
                    className="mt-3 px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                  >
                    Бэлдсэн
                  </button>
                ) : (
                  <p className="mt-3 text-green-600 font-medium">✔ Бэлдсэн</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

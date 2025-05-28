"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import StoreLogo from "../../../public/img/talh_chiher.png";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

interface OrderItem {
  id: number;
  storeName: string;
  storePhone: string;
  timestamp: number;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: string;
  }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [templates, setTemplates] = useState<OrderItem[]>([]);
  const [activeTab, setActiveTab] = useState("order");
  const router = useRouter();

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);

    const savedTemplates = JSON.parse(localStorage.getItem("templates") || "[]");
    setTemplates(savedTemplates);
  }, [activeTab]); // Refresh on tab switch if needed

  const categorizeOrders = (timestamp: number) => {
    const orderDate = new Date(timestamp);
    const now = new Date();
    const diff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 1) return "Өнөөдөр";
    if (diff < 2) return "Өчигдөр";
    if (diff < 7) return "Өнгөрсөн долоо хоног";
    return "Хуучин захиалга";
  };

  const groupedOrders = orders.reduce((acc, order) => {
    const category = categorizeOrders(order.timestamp);
    acc[category] = acc[category] || [];
    acc[category].push(order);
    return acc;
  }, {} as Record<string, OrderItem[]>);

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex gap-4 mb-6 w-full justify-center md:justify-between flex-wrap">
        <button
          onClick={() => setActiveTab("order")}
          className={`px-6 py-3 rounded-xl font-semibold transition-colors duration-300 cursor-pointer ${
            activeTab === "order"
              ? "bg-yellow-300 text-white"
              : "bg-yellow-100 border border-yellow-300 text-yellow-800 hover:bg-yellow-200"
          }`}
        >
          Захиалга
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-6 py-3 rounded-xl font-semibold transition-colors duration-300 cursor-pointer ${
            activeTab === "history"
              ? "bg-green-500 text-white"
              : "bg-green-100 border border-green-500 text-green-800 hover:bg-green-200"
          }`}
        >
          Захиалгын түүх
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`px-6 py-3 rounded-xl font-semibold transition-colors duration-300 cursor-pointer ${
            activeTab === "templates"
              ? "bg-blue-600 text-white"
              : "bg-blue-100 border border-blue-600 text-blue-800 hover:bg-blue-200"
          }`}
        >
          Хадгалсан загвар
        </button>
      </div>

      {activeTab === "order" && (
        <>
          {Object.keys(groupedOrders).length === 0 ? (
            <p>Одоогоор захиалга байхгүй байна.</p>
          ) : (
            Object.entries(groupedOrders).map(([category, ordersInCategory]) => (
              <div key={category} className="mb-6">
                <h2 className="text-lg font-bold mb-2">{category}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {ordersInCategory.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center text-center border"
                    >
                      <Image src={StoreLogo} alt="Store Logo" width={80} height={80} className="rounded mb-4" />
                      <h3 className="text-lg font-semibold mb-1">{order.storeName}</h3>
                      <p className="text-sm text-gray-600 mb-1">📞 {order.storePhone}</p>
                      <ul className="text-sm mb-2 max-h-48 overflow-y-auto">
                        {order.items.map((item) => (
                          <li key={item.id}>
                            {item.name} x {item.quantity} ({item.price})
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => router.push(`/orders/progress?id=${order.id}`)}
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 w-full sm:w-auto"
                      >
                        Захиалга хянах
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </>
      )}

      {activeTab === "templates" && (
        <>
          {templates.length === 0 ? (
            <p>Хадгалсан загвар хоосон байна.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center text-center border"
                >
                  <Image src={StoreLogo} alt="Store Logo" width={80} height={80} className="rounded mb-4" />
                  <h3 className="text-lg font-semibold mb-1">{template.storeName}</h3>
                  <p className="text-sm text-gray-600 mb-1">📞 {template.storePhone}</p>
                  <ul className="text-sm mb-2 max-h-48 overflow-y-auto">
                    {template.items.map((item) => (
                      <li key={item.id}>
                        {item.name} x {item.quantity} ({item.price})
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => {
                      const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
                      const newOrder = {
                        ...template,
                        id: Date.now(),
                        timestamp: Date.now(),
                      };
                      const updatedOrders = [...savedOrders, newOrder];
                      localStorage.setItem("orders", JSON.stringify(updatedOrders));

                      toast.success("Захиалга амжилттай үүслээ!");
                      setTimeout(() => {
                        router.push("/orders");
                      }, 1500);
                    }}
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 w-full sm:w-auto"
                  >
                    Дахин захиалах
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "history" && (
        <>
          {templates.length === 0 ? (
            <p>Захиалгын түүх хоосон байна.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center text-center border"
                >
                  <Image src={StoreLogo} alt="Store Logo" width={80} height={80} className="rounded mb-4" />
                  <h3 className="text-lg font-semibold mb-1">{template.storeName}</h3>
                  <p className="text-sm text-gray-600 mb-1">📞 {template.storePhone}</p>
                  <ul className="text-sm mb-2 max-h-48 overflow-y-auto">
                    {template.items.map((item) => (
                      <li key={item.id}>
                        {item.name} x {item.quantity} ({item.price})
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}

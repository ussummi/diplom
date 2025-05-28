"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function OrderProgressPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const found = savedOrders.find((o: any) => o.id.toString() === orderId);
    setOrder(found);
  }, [orderId]);

  if (!order) return <p className="p-6">Захиалга олдсонгүй.</p>;

  const totalSum = order.items.reduce((sum: number, item: any) => {
    return sum + parseInt(item.price.replace(/[^\d]/g, "")) * item.quantity;
  }, 0);

  const steps = ["Захиалгыг баталсан", "Захиалга замдаа гарсан", "Захиалга хүргэгдсэн"];
  const currentStepIndex = steps.indexOf(order.status ?? "Захиалгыг баталсан");

  const handleConfirmOrder = () => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = savedOrders.filter((o: any) => o.id !== order.id);

    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    const savedTemplates = JSON.parse(localStorage.getItem("templates") || "[]");
    const updatedTemplates = [...savedTemplates, order];

    localStorage.setItem("templates", JSON.stringify(updatedTemplates));

    toast.success("Захиалга хадгалсан загварт нэмэгдлээ!");
    setTimeout(() => {
      router.push("/orders");
    }, 2000);
  };

  return (
    <main className="p-6 bg-gray-100 min-h-screen flex flex-col items-center justify-between">
      <div className="p-6 w-full">
        <div onClick={() => router.push("/orders")} className="mb-4 cursor-pointer text-black-600 text-3xl">←</div>
        <h1 className="text-2xl font-bold mb-12 text-center">Захиалгын явц</h1>

        {/* Order Details & Steps */}
        <div className="flex justify-center w-full gap-6 mb-12">
          <div className="flex flex-col sm:flex-row border bg-white border-black rounded-xl p-4 max-w-3xl w-full gap-4">
            <p><strong>Захиалга хийсэн өдөр:</strong> {new Date(order.timestamp).toLocaleDateString()}</p>
            <p><strong>Нийт дүн:</strong> {totalSum}₮</p>
            <p><strong>Хаяг:</strong> Таны хаяг</p>
            <p><strong>Дугаар:</strong> {orderId}</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center items-center w-full mb-12">
          <div className="relative flex justify-between items-center mb-8 w-full max-w-xl gap-4">
            <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-black z-0" />
            {steps.map((step, idx) => {
              const isActive = idx === currentStepIndex;
              const isCompleted = idx < currentStepIndex;
              return (
                <div key={idx} className="relative z-10 flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg ${isCompleted || isActive ? "bg-green-600" : "bg-black"}`}>
                    {isCompleted || isActive ? "✓" : idx + 1}
                  </div>
                  <span className={`mt-2 text-sm ${isActive ? "text-green-600 font-bold" : "text-black"}`}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Items */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Барааны мэдээлэл</h2>
          <ul className="list-disc list-inside">
            {order.items.map((item: any) => (
              <li key={item.id}>{item.name} x {item.quantity} ({item.price})</li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center mt-6 gap-4">
          {currentStepIndex < 2 ? (
            <button
              onClick={() => {
                const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
                const updated = savedOrders.filter((_: any) => _.id !== order.id);
                localStorage.setItem("orders", JSON.stringify(updated));

                toast.success("Захиалга цуцлагдлаа!");
                setTimeout(() => {
                  router.push("/orders");
                }, 3000);
              }}
              className="bg-red-600 text-white px-4 py-3 rounded w-full sm:w-auto"
            >
              Захиалга цуцлах
            </button>
          ) : (
            <button onClick={handleConfirmOrder} className="bg-green-600 text-white px-4 py-3 rounded w-full sm:w-auto">
              Захиалга хадгалсан загварт нэмэх
            </button>
          )}
          <button onClick={() => router.back()} className="bg-[#5A6DEA] text-white px-4 py-3 rounded w-full sm:w-auto">
            Буцах
          </button>
        </div>
      </div>
      <Toaster position="top-center" />
    </main>
  );
}

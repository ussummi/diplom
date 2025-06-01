"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  price: string;
};

type Order = {
  id: number;
  items: OrderItem[];
  timestamp: number;
  status: string;
  orderedDate?: string;
  confirmedDate?: string;
  deliveryAddress?: string;
  estimatedDelivery?: string;
  deliveredDate?: string;
  deliveredSignature?: string;
};

export default function OrderProgressPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const [order, setOrder] = useState<Order | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  useEffect(() => {
    const savedOrders: Order[] = JSON.parse(localStorage.getItem("orders") || "[]");
    const found = savedOrders.find((o) => o.id.toString() === orderId);
    if (found) {
      setOrder({
        ...found,
        orderedDate: new Date(found.timestamp).toLocaleDateString(),
        confirmedDate: new Date(found.timestamp + 3600 * 1000 * 24).toLocaleDateString(),
        deliveryAddress: "Улаанбаатар хот, Сонгинохайрхан дүүрэг, 3-р хороо",
        estimatedDelivery: new Date(found.timestamp + 3600 * 1000 * 24 * 3).toLocaleDateString(),
        deliveredDate: new Date(found.timestamp + 3600 * 1000 * 24 * 4).toLocaleDateString(),
        deliveredSignature: "John Doe",
      });
    } else {
      setOrder(null);
    }
  }, [orderId]);
  

  if (!order) return <p className="p-6">Захиалга олдсонгүй.</p>;

  const totalSum = order.items.reduce((sum, item) => {
    const numericPrice = parseInt(item.price.replace(/[^\d]/g, ""));
    return sum + numericPrice * item.quantity;
  }, 0);

  const steps = ["Захиалгыг баталсан", "Захиалга замдаа гарсан", "Захиалга хүргэгдсэн"];
  const currentStepIndex = steps.indexOf(order.status ?? "Захиалгыг баталсан");
  const closeDialog = () => setActiveStep(null);

  return (
    <main className="p-6 bg-gray-100 min-h-screen flex flex-col items-center justify-between">
      <div className="p-6 w-full max-w-4xl">
        <div onClick={() => router.push("/orders")} className="mb-4 cursor-pointer text-black text-3xl">←</div>
        <h1 className="text-2xl font-bold mb-12 text-center">Захиалгын явц</h1>

        <div className="flex justify-center w-full gap-6 mb-12">
          <div className="flex flex-col sm:flex-row border bg-white border-black rounded-xl p-4 max-w-3xl w-full gap-4">
            <p><strong>Захиалга хийсэн өдөр:</strong> {new Date(order.timestamp).toLocaleDateString()}</p>
            <p><strong>Нийт дүн:</strong> {totalSum.toLocaleString()}₮</p>
            <p><strong>Хаяг:</strong> Таны хаяг</p>
            <p><strong>Дугаар:</strong> {orderId}</p>
          </div>
        </div>

        <div className="flex justify-center items-center w-full mb-12">
          <div className="relative flex justify-between items-center mb-8 w-full max-w-xl gap-4">
            <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-black z-0" />
            {steps.map((step, idx) => {
  const isActive = idx === currentStepIndex;
  const isCompleted = idx < currentStepIndex;

  return (
    <div
      key={idx}
      className="relative z-10 flex flex-col items-center cursor-pointer"
      onClick={() => {
        if (idx === currentStepIndex) {
          setActiveStep(idx); // Only open dialog for current active step
        }
      }}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg ${
          isCompleted || isActive ? "bg-green-600" : "bg-black"
        }`}
      >
        {isCompleted || isActive ? "✓" : idx + 1}
      </div>
      <span className={`mt-2 text-sm ${isActive ? "text-green-600 font-bold" : "text-black"}`}>
        {step}
      </span>
    </div>
  );
})}

          </div>
        </div>

        {activeStep !== null && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="bg-white rounded-lg max-w-lg w-full p-6 relative shadow-lg">
              <button
                onClick={closeDialog}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
                aria-label="Close"
              >
                ×
              </button>

              {activeStep === 0 && (
                <>
                  <h2 className="text-xl font-semibold mb-4">Захиалгыг баталсан</h2>
                  <p><strong>Захиалсан огноо:</strong> {order.orderedDate}</p>
                  <p><strong>Баталсан огноо:</strong> {order.confirmedDate}</p>
                  <p><strong>Хүргэх хаяг:</strong> {order.deliveryAddress}</p>
                  <p><strong>Нийт үнэ:</strong> {totalSum.toLocaleString()}₮</p>
                  <h3 className="mt-4 font-semibold">Захиалсан бараанууд:</h3>
                  <ul className="list-disc list-inside max-h-48 overflow-auto">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex justify-between">
                        <span>{item.name} x {item.quantity}</span>
                        <span>{item.price}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {activeStep === 1 && (
                <>
                  <h2 className="text-xl font-semibold mb-4">Захиалга замдаа гарсан</h2>
                  <p><strong>Захиалсан огноо:</strong> {order.orderedDate}</p>
                  <p><strong>Баталсан огноо:</strong> {order.confirmedDate}</p>
                  <p><strong>Хүргэх хаяг:</strong> {order.deliveryAddress}</p>
                  <p><strong>Тооцоологдсон хүргэлтийн цаг:</strong> {order.estimatedDelivery}</p>
                  <h3 className="mt-4 font-semibold">Бараанууд:</h3>
                  <ul className="list-disc list-inside max-h-48 overflow-auto">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex justify-between">
                        <span>{item.name} x {item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {activeStep === 2 && (
                <>
                  <h2 className="text-xl font-semibold mb-4">Захиалга хүргэгдсэн</h2>
                  <p><strong>Хүргэгдсэн огноо:</strong> {order.deliveredDate}</p>
                  <p><strong>Хүргэлтийн гарын үсэг:</strong> {order.deliveredSignature}</p>
                </>
              )}
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="font-semibold mb-2">Захиалгын мэдээлэл</h2>
          <ul className="list-disc list-inside">
            {order.items.map((item) => (
              <li key={item.id}>
                {item.name} x {item.quantity} ({item.price})
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap justify-center mt-6 gap-4">
          {currentStepIndex < 2 ? (
            <button
              onClick={() => {
                const savedOrders: Order[] = JSON.parse(localStorage.getItem("orders") || "[]");
                const updated = savedOrders.filter((o) => o.id !== order.id);
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
            <button
              onClick={() => {
                const savedOrders: Order[] = JSON.parse(localStorage.getItem("orders") || "[]");
                const updatedOrders = savedOrders.filter((o) => o.id !== order.id);
                localStorage.setItem("orders", JSON.stringify(updatedOrders));

                const savedTemplates: Order[] = JSON.parse(localStorage.getItem("templates") || "[]");
                const updatedTemplates = [...savedTemplates, order];
                localStorage.setItem("templates", JSON.stringify(updatedTemplates));

                toast.success("Захиалга хадгалсан загварт нэмэгдлээ!");
                setTimeout(() => {
                  router.push("/orders");
                }, 2000);
              }}
              className="bg-green-600 text-white px-4 py-3 rounded w-full sm:w-auto cursor-pointer"
            >
              Захиалга хадгалсан загварт нэмэх
            </button>
          )}
          <button
            onClick={() => router.back()}
            className="bg-[#5A6DEA] text-white px-4 py-3 rounded w-full sm:w-auto cursor-pointer"
          >
            Буцах
          </button>
        </div>
      </div>
      <Toaster position="top-center" />
    </main>
  );
}

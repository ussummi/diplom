"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import StoreImg from "../../../../public/img/product.png";
import toast, { Toaster } from "react-hot-toast";

type Product = {
  id: number;
  name: string;
  price: string;
  ingredients?: string;
};

type Store = {
  ID: number;
  name: string;
  phone: string;
  address: string;
  description: string;
  rating?: string;
  promotions?: string[];
  products: Product[];
};

type OrderItem = {
  id: number;
  name: string;
  price: string;
  quantity: number;
};

export default function StorePage() {
  const params = useParams();
  const storeId = params?.id?.toString() ?? "";

  const [mounted, setMounted] = useState(false);
  const [store, setStore] = useState<Store | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [order, setOrder] = useState<OrderItem[]>([]);

  useEffect(() => {
    setMounted(true);
    fetch("/storesData.json")
      .then((res) => res.json())
      .then((data: Store[]) => {
        const foundStore = data.find((s) => s.ID.toString() === storeId);
        setStore(foundStore ?? null);
      });
  }, [storeId]);

  const addToOrder = (product: Product, quantity: number) => {
    setOrder((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        const updatedQty = existing.quantity + quantity;
        if (updatedQty <= 0) {
          return prev.filter((item) => item.id !== product.id);
        }
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: updatedQty } : item
        );
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
          },
        ];
      }
    });
  };

  const removeFromOrder = (productId: number) => {
    setOrder((prev) => prev.filter((item) => item.id !== productId));
  };

  const totalSum = order.reduce((sum, item) => {
    const priceNum = parseInt(item.price.replace(/[^\d]/g, "")) || 0;
    return sum + priceNum * item.quantity;
  }, 0);

  const handlePlaceOrder = () => {
    if (order.length === 0) {
      toast.error("Захиалга үүсгээгүй байна. Бараа сонгоно уу.");
      return;
    }

    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const timestamp = Date.now();
    const orderId = timestamp;

    const updatedOrders = [
      ...savedOrders,
      {
        id: orderId,
        storeName: store?.name,
        storePhone: store?.phone,
        timestamp,
        items: order,
      },
    ];

    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    toast.success("Захиалга хадгалагдлаа!");
    setOrder([]);
  };

  if (!mounted) return null;
  if (!store)
    return <p className="text-center text-red-500 p-6">Store not found.</p>;

  return (
    <main className="px-6 py-8 flex flex-col lg:flex-row gap-6 overflow-x-hidden">
      <Toaster position="top-center" />
      {/* Store Info */}
      <aside className="w-full lg:w-1/3 h-auto rounded p-4 overflow-y-auto max-h-screen">
        <h2 className="font-semibold mb-2 text-xl">Танилцуулга:</h2>
        <p className="text-sm mb-4">{store.description}</p>
        <p className="font-semibold">📍 Байршил: {store.address}</p>
        <p className="font-semibold">📞 Утас: {store.phone}</p>
        <p className="font-semibold">⭐ Үнэлгээ: {store.rating ?? "☆☆☆☆☆"}</p>
        <div className="mt-4 border rounded-xl bg-white border-black p-4">
          <h3 className="font-bold">Урамшуулал</h3>
          <ul className="list-disc list-inside text-sm">
            {store.promotions?.length ? (
              store.promotions.map((promo, idx) => (
                <li key={idx}>{promo}</li>
              ))
            ) : (
              <li>Урамшуулал байхгүй</li>
            )}
          </ul>
        </div>
      </aside>

      <section className="w-full lg:w-2/3 flex flex-col gap-6 overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {store.products.map((product) => {
            const quantity =
              order.find((item) => item.id === product.id)?.quantity || 0;
            return (
              <div
                key={product.id}
                className="border rounded-xl bg-white border-black shadow p-4 text-center cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => {
                  setSelectedProduct(product);
                  setSelectedQuantity(1);
                }}
              >
                <Image
                  src={StoreImg}
                  alt={product.name}
                  width={500}
                  height={300}
                  className="w-full h-40 object-cover rounded-xl"
                />
                <h3 className="font-semibold mt-2">{product.name}</h3>
                <p>{product.price}</p>
                <div className="flex justify-between items-center mt-2 space-x-2 border border-black rounded-xl overflow-hidden">
                  <button
                    disabled={quantity === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToOrder(product, -1);
                    }}
                    className={`text-white text-lg px-3 py-1 transition duration-300 ${
                      quantity === 0
                        ? "bg-[#5A6DEA] cursor-not-allowed"
                        : "bg-[#5A6DEA] hover:bg-blue-700 cursor-pointer"
                    }`}
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold px-2">{quantity}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToOrder(product, 1);
                    }}
                    className="bg-[#5A6DEA] cursor-pointer text-white text-lg px-3 py-1 hover:bg-blue-700 transition duration-300"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border rounded-xl bg-white border-black p-4">
          <h3 className="font-semibold text-lg mb-2">Захиалгын нийт дүн:</h3>
          {order.length === 0 ? (
            <p>Одоогоор бараа сонгогдоогүй байна.</p>
          ) : (
            <ul className="text-sm">
              {order.map(
                (item) =>
                  item.quantity !== 0 && (
                    <li
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <span>
                        {item.name} x {item.quantity} ({item.price})
                      </span>
                      <button
                        onClick={() => removeFromOrder(item.id)}
                        className="text-red-600 ml-2"
                      >
                        ✖️
                      </button>
                    </li>
                  )
              )}
            </ul>
          )}
          <p className="mt-2 font-bold">Нийт: {totalSum}₮</p>
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePlaceOrder}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Захиалах
            </button>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 overflow-auto backdrop-blur-sm">
          <div className="relative border border-black bg-white rounded-lg p-6 w-80 text-center overflow-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-2 right-2 bg-white text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-300 transition"
            >
              ✖
            </button>
            <Image
              src={StoreImg}
              alt={selectedProduct.name}
              width={200}
              height={120}
              className="mx-auto mb-4 rounded"
            />
            <h2 className="text-lg font-bold">{selectedProduct.name}</h2>
            <p>Орц: {selectedProduct.ingredients}</p>
            <p>Үнэ: {selectedProduct.price}</p>
            <div className="flex justify-between items-center mt-2 space-x-2 border border-black rounded-xl overflow-hidden">
              <button
                onClick={() => setSelectedQuantity((q) => Math.max(1, q - 1))}
                className={`text-white text-lg px-5 py-1 transition duration-300 ${
                  selectedQuantity === 1
                    ? "bg-[#5A6DEA] cursor-not-allowed"
                    : "bg-[#5A6DEA] hover:bg-blue-700 cursor-pointer"
                }`}
              >
                -
              </button>
              <span>{selectedQuantity}</span>
              <button
                onClick={() => setSelectedQuantity((q) => q + 1)}
                className="bg-[#5A6DEA] cursor-pointer text-white text-lg px-5 py-1 hover:bg-blue-700 transition duration-300"
              >
                +
              </button>
            </div>
            <button
              onClick={() => {
                addToOrder(selectedProduct, selectedQuantity);
                setSelectedProduct(null);
                setSelectedQuantity(1);
              }}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            >
              Баталгаажуулах
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

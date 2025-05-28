"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function MerchantPage() {
  const [merchants, setMerchants] = useState<any[]>([]);

  useEffect(() => {
    fetch("/merchantData.json")
      .then((res) => res.json())
      .then((data) => {
        setMerchants(data);
      });
  }, []);

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Аж ахуйн нэгжүүд</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {merchants.map((merchant) => {
          const rating = Math.max(0, Math.min(Number(merchant.rating), 5)); // Ensure rating is within 0-5
          return (
            <div
              key={merchant.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 flex flex-col items-center text-center border"
            >
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }, (_, index) => (
                  <span
                    key={index}
                    className={`text-lg ${index < rating ? "text-yellow-500" : "text-gray-300"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <Image
                src="/svg/merchant.svg"
                alt={`${merchant.name} Logo`}
                width={100}
                height={100}
                className="h-40 w-100 object-cover rounded-xl mb-4"
              />
              <h2 className="text-lg font-semibold mb-2">{merchant.name}</h2>
              <p>📞 {merchant.phone}</p>
              <button
                className="mt-4 bg-[#5A6DEA] text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all duration-300"
                onClick={() => {
                  window.location.href = `/merchant/${merchant.id}`;
                }}
              >
                Шалгах
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearch } from "@/app/context/SearchContext";

interface Merchant {
  id: string;
  name: string;
  phone: string;
  rating: number;
}

export default function MerchantPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const { searchTerm } = useSearch();

  useEffect(() => {
    fetch("/merchantData.json")
      .then((res) => res.json())
      .then((data) => {
        setMerchants(data);
      });
  }, []);

  const filteredMerchants = merchants.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Аж ахуйн нэгжүүд</h1>

      {filteredMerchants.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          Хайлтын үр дүн олдсонгүй
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredMerchants.map((merchant) => {
            const rating = Math.max(0, Math.min(Number(merchant.rating), 5));
            return (
              <div
                key={merchant.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 flex flex-col items-center text-center border"
              >
                <div className="flex items-center mb-2">
                  {Array.from({ length: 5 }, (_, index) => (
                    <span
                      key={index}
                      className={`text-lg ${
                        index < rating ? "text-yellow-500" : "text-gray-300"
                      }`}
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
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TalhImg from "../../../public/img/talh_chiher.png";
import { useSearch } from "@/app/context/SearchContext";

type Store = {
  ID: number;
  name: string;
  phone: string;
  address: string;
};

export default function StoresPage() {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const { searchTerm } = useSearch();
  const filteredOrders = stores.filter((order) =>
  order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  order.phone.toLowerCase().includes(searchTerm.toLowerCase())
);


  useEffect(() => {
    fetch("/storesData.json")
      .then((res) => res.json())
      .then((data: Store[]) => setStores(data));
  }, []);

  const goToStore = (id: number) => {
    const store = stores.find((s) => s.ID === id);
    if (store) {
      localStorage.setItem("selectedStore", JSON.stringify(store));
      router.push(`/store/${id}`);
    }
  };

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Аж ахуйн нэгжүүд</h1>
      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          Хайлтын үр дүн олдсонгүй
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredOrders.map((org) => (
            <div
              key={org.ID}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 flex flex-col justify-between items-center text-center border cursor-pointer transition-all duration-300"
              onClick={() => goToStore(org.ID)}
            >
              <Image
                src={TalhImg}
                alt={`${org.name} Logo`}
                width={100}
                height={100}
                className="rounded-full mb-4"
              />
              <h2 className="text-lg font-semibold mb-2">{org.name}</h2>
              <p>📞 {org.phone}</p>
              <p>📍 {org.address}</p>
              <button className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all duration-300">
                Захиалга хийх
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

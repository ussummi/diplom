"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TalhImg from "../../../public/img/talh_chiher.png";

export default function StoresPage() {
  const router = useRouter();
  const [stores, setStores] = useState<any[]>([]);

  useEffect(() => {
    fetch("/storesData.json")
      .then((res) => res.json())
      .then((data) => setStores(data));
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {stores.map((org) => (
          <div
            key={org.ID}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 flex flex-col items-center text-center border cursor-pointer transition-all duration-300"
            onClick={() => goToStore(org.ID)}
          >
            <Image src={TalhImg} alt={`${org.name} Logo`} width={100} height={100} className="rounded-full mb-4" />
            <h2 className="text-lg font-semibold mb-2">{org.name}</h2>
            <p>📞 {org.phone}</p>
            <p>📍 {org.address}</p>
            <button className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all duration-300">
              Захиалга хийх
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

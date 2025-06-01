"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearch } from "@/app/context/SearchContext";

interface Complaint {
  address: string;
  store_name: string;
  store_id: string;
  item_name: string;
  item_id: string;
  remarks: string;
  imageList: string[];
  created_date: string;
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const { searchTerm } = useSearch();

  useEffect(() => {
    fetch("/complaintsData.json")
      .then((res) => res.json())
      .then((data) => setComplaints(data));
  }, []);

  const filteredComplaints = complaints.filter((complaint) =>
    complaint.store_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Гомдолууд</h1>

      {filteredComplaints.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">Хайлтын үр дүн олдсонгүй</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint.store_id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 flex justify-between flex-col items-center text-center border"
            >
              <div className="mb-4">
                <Image
                  src="/svg/merchant.svg"
                  alt={`${complaint.store_name} Logo`}
                  width={100}
                  height={100}
                  className="h-40 w-100 object-cover rounded-xl mb-4"
                />
              </div>
              <h2 className="text-lg font-semibold mb-2">{complaint.store_name}</h2>
              <p>📞 {complaint.remarks}</p>
              <Link href={`/merchant/complaints/${complaint.store_id}`} passHref>
                <button
                  className="mt-4 bg-[#41FF1B] text-white px-5 py-2 rounded-full hover:bg-green-500 transition-all duration-300"
                >
                  Шалгах
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

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

export default function ComplaintDetailPage() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [pastWeekComplaints, setPastWeekComplaints] = useState<Complaint[]>([]);
  const [pastMonthComplaints, setPastMonthComplaints] = useState<Complaint[]>(
    []
  );

  useEffect(() => {
    if (id) {
      const complaintId = id.toString();

      fetch("/complaintsData.json")
        .then((res) => res.json())
        .then((data) => {
          const foundComplaint = data.find(
            (c: Complaint) => c.store_id === complaintId
          );
          setComplaint(foundComplaint || null);

          const currentDate = new Date();
          const pastWeek = new Date(
            currentDate.setDate(currentDate.getDate() - 7)
          );
          const pastMonth = new Date(
            currentDate.setMonth(currentDate.getMonth() - 1)
          );

          const weekComplaints = data.filter(
            (c: Complaint) => new Date(c.created_date) > pastWeek
          );
          setPastWeekComplaints(weekComplaints);

          const monthComplaints = data.filter(
            (c: Complaint) => new Date(c.created_date) > pastMonth
          );
          setPastMonthComplaints(monthComplaints);
        })
        .catch((error) => {
          console.error("Error fetching complaint data:", error);
          setComplaint(null);
        });
    }
  }, [id]);

  if (!id) {
    return <div>Invalid complaint ID</div>;
  }

  if (!complaint) {
    return <div>Loading complaint details...</div>;
  }

  const createdDate = new Date(complaint.created_date);
  const formattedDate = createdDate.toLocaleString("mn-MN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Гомдолын дэлгэрэнгүй
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4">
            Ирсэн гомдол: {complaint.store_name}
          </h2>
          <div className="bg-white border-black border rounded-xl p-6 mb-6">
            <p>
              <strong>Гомдол илгээсэн байршил:</strong> {complaint.address}
            </p>
          </div>
          <div className="bg-white border-black border rounded-xl p-6 mb-6">
            <div className="flex flex-row gap-4 mb-6">
              {complaint.imageList?.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`Complaint image ${index + 1}`}
                  width={200}
                  height={200}
                  className="object-cover rounded-xl"
                />
              ))}
            </div>
          </div>

          <div className="bg-white border-black border rounded-xl p-6 mb-6">
            <p>
              <strong>Гомдол ирсэн барааны нэр:</strong> {complaint.item_name}
            </p>
          </div>

          <div className="bg-white border-black border rounded-xl p-6">
            <p>
              <strong>Тайлбар:</strong> {complaint.remarks}
            </p>
            <p>
              <strong>Гомдол ирсэн огноо:</strong> {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <h2 className="text-xl font-semibold mb-4">
            Өнгөрсөн долоо хоногт ирсэн гомдол
          </h2>
          <div className="bg-white border-black border rounded-xl p-6">
            <ul>
              {pastWeekComplaints.map((complaint, index) => (
                <li key={index} className="mb-2">
                  <p>
                    <strong>{complaint.store_name}</strong> -{" "}
                    {complaint.item_name}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <h2 className="text-xl font-semibold mb-4">
            Өнгөрсөн сар ирсэн гомдол
          </h2>
          <div className="bg-white border-black border rounded-xl p-6">
            <ul>
              {pastMonthComplaints.map((complaint, index) => (
                <li key={index} className="mb-2">
                  <p>
                    <strong>{complaint.store_name}</strong> -{" "}
                    {complaint.item_name}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

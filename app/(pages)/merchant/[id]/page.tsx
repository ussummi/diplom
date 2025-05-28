"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Merchant {
  id: number;
  name: string;
  address: string;
  phone: string;
  registration_number: string;
  logo: string;
  rating: number;
  order_information: Array<{
    order_id: string;
    status: string;
    order_date: string;
  }>;
  receivable_information: Array<{
    status: string;
    amount: number;
  }>;
}

export default function MerchantPage() {
  const { id } = useParams();
  const [merchant, setMerchant] = useState<Merchant | null>(null);

  useEffect(() => {
    if (id) {
      const merchantId = parseInt(id.toString());

      fetch("/merchantData.json")
        .then((res) => res.json())
        .then((data) => {
          const foundMerchant = data.find((m: Merchant) => m.id === merchantId);
          setMerchant(foundMerchant || null);
        })
        .catch((error) => {
          console.error("Error fetching merchant data:", error);
          setMerchant(null);
        });
    }
  }, [id]);

  if (!merchant) {
    return <div>Loading merchant details...</div>;
  }

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < rating ? "★" : "☆");
    }
    return stars.join(""); 
  };

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">{merchant.name}</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 p-6">
          <div className="bg-white border-black border rounded-xl p-6 mb-6 text-start">
            <div className="w-50 h-50 mx-auto mb-4">
              <Image
                src={merchant.logo || "/svg/merchant.svg"}
                alt={`${merchant.name} Logo`}
                width={96}
                height={96}
                className="rounded-xl object-cover w-100"
              />
            </div>
            <p><strong>Байгууллагын регистер:</strong> {merchant.registration_number}</p>
            <p><strong>Байгууллагын нэр:</strong> {merchant.name}</p>
            <p><strong>Байгууллагын хаяг:</strong> {merchant.address}</p>
            <p><strong>Холбогдох утасны дугаар:</strong> {merchant.phone}</p>
            <p><strong>Үнэлгээ:</strong> <span className="text-yellow-500">{renderStars(merchant.rating)}</span></p>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-6">
          <div className="bg-white border-black border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Захиалгын түүх</h2>
            {merchant.order_information.length > 0 ? (
              <ul>
                {merchant.order_information.map((order, index) => (
                  <li key={index}>
                    <p>{order.order_id}: {order.status} ({order.order_date})</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Хоосон байна</p>
            )}
          </div>

          <div className="bg-white border-black border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Авлагын мэдээлэл</h2>
            {merchant.receivable_information.length > 0 ? (
              <ul>
                {merchant.receivable_information.map((receivable, index) => (
                  <li key={index}>
                    <p>{receivable.status}: {receivable.amount}₮</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Хоосон байна</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

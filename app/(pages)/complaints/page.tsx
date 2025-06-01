"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

interface Store {
  ID: number;
  name: string;
  products: { id: number; name: string }[];
}

interface Complaint {
  store: string;
  item: string;
  image: string | null;
  description: string;
  status: string;
}

export default function ComplaintsPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/storesData.json")
      .then((res) => res.json())
      .then((data) => setStores(data));

    const saved = localStorage.getItem("complaints");
    if (saved) setComplaints(JSON.parse(saved));
  }, []);

  const handleSaveComplaint = () => {
    if (!selectedStoreId || !selectedItemId || !description.trim()) {
      toast.error("Бүх талбарыг бөглөнө үү.");
      return;
    }

    const store = stores.find((s) => s.ID.toString() === selectedStoreId);
    const item = store?.products.find(
      (i) => i.id.toString() === selectedItemId
    );

    if (!store || !item) {
      toast.error("Сонголтоо зөв хийнэ үү.");
      return;
    }

    const newComplaint: Complaint = {
      store: store.name,
      item: item.name,
      image: imageFile ? URL.createObjectURL(imageFile) : null,
      description,
      status: "Шинээр бүртгэгдсэн",
    };

    const updated = [...complaints, newComplaint];
    setComplaints(updated);
    localStorage.setItem("complaints", JSON.stringify(updated));
    setSelectedStoreId("");
    setSelectedItemId("");
    setImageFile(null);
    setDescription("");
    toast.success("Гомдол амжилттай хадгалагдлаа!");
  };

  if (!mounted) return null;

  const selectedStore = stores.find((s) => s.ID.toString() === selectedStoreId);
  const itemsForStore = selectedStore?.products ?? [];

  return (
    <main className="flex flex-col sm:flex-row gap-6 px-6 py-8">
      <Toaster position="top-center" />

      <section className="w-full sm:w-3/8 bg-white border border-black rounded-xl p-4 max-h-150 shadow overflow-auto">
        <h2 className="text-xl font-bold mb-4">Гомдолын бүртгэл форм</h2>

        <select
          className="w-full border border-black rounded-xl p-3 mb-4"
          value={selectedStoreId}
          onChange={(e) => {
            setSelectedStoreId(e.target.value);
            setSelectedItemId("");
          }}
        >
          <option value="">Дэлгүүр сонгох</option>
          {stores.map((s) => (
            <option key={s.ID} value={s.ID}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          className="w-full border border-black rounded-xl p-3 mb-4"
          value={selectedItemId}
          onChange={(e) => setSelectedItemId(e.target.value)}
          disabled={!selectedStoreId}
        >
          <option value="">Бараа сонгох</option>
          {itemsForStore.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </select>

        <div className="w-full mb-4 relative">
          <label className="block">
            Зураг оруулах:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="hidden"
              id="image-upload"
            />
            <div
              onClick={() => document.getElementById("image-upload")?.click()}
              className="mt-3 border border-black rounded-xl w-full h-32 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors duration-300 overflow-hidden relative"
            >
              {imageFile ? (
                <>
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Uploaded"
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageFile(null);
                    }}
                    className="absolute top-1 right-1 bg-white text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-300"
                  >
                    ✖
                  </button>
                </>
              ) : (
                <span className="w-12 h-12 border border-black rounded-full flex items-center justify-center text-3xl font-normal">
                  +
                </span>
              )}
            </div>
          </label>
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-black rounded-xl p-2 mb-4"
          rows={4}
          placeholder="Тайлбар"
        />

        <div className="flex justify-end">
          <button
            onClick={handleSaveComplaint}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Хадгалах
          </button>
        </div>
      </section>

      <section className="w-full sm:w-5/8 bg-white border border-black rounded-xl p-4 shadow">
        <h2 className="text-xl font-bold mb-4">Бүх гомдол</h2>
        {complaints.length === 0 ? (
          <p>Одоогоор гомдол бүртгэгдээгүй байна.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {complaints.map((c, idx) => (
              <div
                key={idx}
                className="border border-black rounded-xl p-2 flex justify-between flex-col items-center text-center"
              >
                <h3 className="font-semibold">{c.store}</h3>
                {c.image && (
                  <Image
                    src={c.image}
                    alt="complaint"
                    width={100}
                    height={100}
                    className="my-2 object-cover rounded"
                  />
                )}
                <div className="text-start text-sm w-full">
                  <p>
                    <strong>Бараа: </strong>
                    {c.item}
                  </p>
                  <p className="mt-1 max-h-24 overflow-y-auto">
                    {c.description}
                  </p>
                </div>
                <button
                  disabled
                  className="mt-2 bg-[#5A6DEA] text-white px-4 py-1 rounded-lg cursor-default"
                >
                  {c.status}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

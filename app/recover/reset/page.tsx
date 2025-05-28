"use client";

import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import SrcImage from "../../../public/svg/recover.svg";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

//  ------------------------------------------ eniig ashiglaad otp ywuulsan utasnii dugaaaraaa awna
//   useEffect(() => {
//     const storedPhone = localStorage.getItem("recoveryPhone");
//     if (storedPhone) {
//       setPhoneNumber(storedPhone);
//     } else {
//       toast.error("Утасны дугаар олдсонгүй. Эргээд оролдоно уу.");
//       router.push("/recover");  // Redirect back if no number found
//     }
//   }, []);

  const handleResetPassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error("Бүх талбарыг бөглөнө үү.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Нууц үг таарахгүй байна.");
      return;
    }

    setLoading(true);
    // end reset hiine
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Нууц үг амжилттай шинэчлэгдлээ.");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        toast.error(data.message || "Шинэчлэлт амжилтгүй боллоо.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Системийн алдаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <section className="flex w-full max-w-5xl bg-white rounded-xl shadow-md overflow-hidden">
        <div className="w-full md:w-1/2 p-16 md:p-32 flex flex-col justify-center space-y-8">
          <h1 className="text-3xl font-semibold text-center">Нууц үг шинэчлэх</h1>

          <p className="text-center text-gray-700">Утас: {phoneNumber}</p>

          <Input
            type="password"
            placeholder="Шинэ нууц үг"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Шинэ нууц үг давтах"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition duration-300 text-lg"
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? "Түр хүлээнэ үү..." : "Батлах"}
          </button>
        </div>

        <div className="hidden md:block w-1/2 p-16">
          <Image src={SrcImage} alt="Recovery" className="h-full w-full object-cover" width={500} height={500} />
        </div>
      </section>
    </main>
  );
}

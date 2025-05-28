"use client";

import { Input } from "@/components/ui/input";
import SrcImage from "../../../public/svg/recover.svg";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(0);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const sendOtp = () => {
    if (!phoneNumber.trim()) {
      toast.error("Утасны дугаараа оруулна уу!");
      return;
    }
    toast.success(`OTP илгээгдлээ: ${phoneNumber}`);
    setShowOtp(true);
    setTimer(60);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit.length === 1)) {
      const otpCode = newOtp.join("");

    //   END OTP hesgee hiih
      if (otpCode === "1234") {
        toast.success("Амжилттай");
        setTimeout(() => router.push("/recover/reset"), 1500);
      } else {
        toast.error("OTP буруу байна.");
      }
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <section className="flex w-full max-w-4xl p-2 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="w-full md:w-1/2 p-16 flex flex-col justify-center space-y-6">
          <h1 className="text-2xl font-semibold text-center">Нууц үг сэргээх</h1>

          {!showOtp ? (
            <>
              <div>
                <label className="block mb-1">Утасны дугаараа оруулна уу.</label>
                <Input
                  className="p-6 border-black"
                  type="text"
                  placeholder="12345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <button
                className="bg-blue-600 text-white cursor-pointer px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                onClick={sendOtp}
              >
                Илгээх
              </button>
            </>
          ) : (
            <>
              <div className="flex justify-center space-x-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputsRef.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-16 h-16 text-2xl text-center border border-black rounded-full focus:outline-none"
                  />
                ))}
              </div>
              <p className="text-center text-gray-500 text-sm mt-2">
                Илгээгдсэн кодыг оруулна уу.
              </p>
              <button
                className={`mt-4 px-6 py-2 rounded-lg text-white ${
                  timer > 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#5A6DEA] hover:bg-blue-700 transition duration-300"
                }`}
                onClick={timer === 0 ? sendOtp : undefined}
                disabled={timer > 0}
              >
                {timer > 0 ? `Дахин илгээх (${timer}s)` : "Дахин илгээх"}
              </button>
            </>
          )}

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500 text-sm">эсвэл</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <Link href="/login">
            <button className="bg-white border mb-2 border-black cursor-pointer px-8 py-3 rounded-lg hover:bg-gray-200 transition duration-300 w-full">
              Нэвтрэх хэсэгрүү буцах
            </button>
          </Link>
        </div>

        <div className="hidden md:block w-1/2 p-8">
          <Image
            src={SrcImage}
            alt="Login Illustration"
            className="h-full w-full object-cover"
            width={300}
            height={300}
          />
        </div>
      </section>
    </main>
  );
}

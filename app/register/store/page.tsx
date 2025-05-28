"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SrcImage from "../../../public/img/image 2.png";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!username || !regNumber || !location || !password) {
      toast.error("Бүх талбарыг бөглөнө үү!");
      return;
    }

    if (password.length < 6) {
      toast.error("Нууц үг дор хаяж 6 тэмдэгт байх шаардлагатай!");
      return;
    }

    toast.success("Бүртгэл амжилттай!");
    router.push("/stores");
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />

      <section className="flex w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden">
        <div className="w-full md:w-1/2 p-8">
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-center">Бүртгүүлэх</h1>

            <div>
              <label className="block mb-1">Хэрэглэгчийн нэр</label>
              <Input
                type="text"
                placeholder="Хэрэглэгчийн нэр"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1">Байгууллагын регистер</label>
              <Input
                type="text"
                placeholder="Регистер"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1">Байршил дүүрэг хороо</label>
              <Input
                type="text"
                placeholder="Байршил"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1">Нууц үг</label>
              <Input
                type="password"
                placeholder="Нууц үг"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col items-end space-y-2">
              <Button
                className="w-full bg-[#5A6DEA] text-white hover:bg-blue-700 transition-colors duration-300"
                onClick={handleRegister}
              >
                Бүртгэл үүсгэх
              </Button>
            </div>
          </div>
        </div>

        <div className="hidden md:block w-1/2">
          <Image
            src={SrcImage}
            alt="Login Illustration"
            className="h-full w-full object-cover"
            width={512}
            height={512}
          />
        </div>
      </section>
    </main>
  );
}

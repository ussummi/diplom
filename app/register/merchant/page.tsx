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

  const [orgName, setOrgName] = useState("");
  const [orgReg, setOrgReg] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!orgName || !orgReg || !phone || !password) {
      toast.error("Бүх талбарыг бөглөнө үү!");
      return;
    }

    if (!/^\d{8}$/.test(phone)) {
      toast.error("Утасны дугаар буруу байна!");
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
              <label className="block mb-1">Байгууллагын нэр</label>
              <Input
                type="text"
                placeholder="Байгууллагын нэр"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1">Байгууллагийн регистер</label>
              <Input
                type="text"
                placeholder="Регистер"
                value={orgReg}
                onChange={(e) => setOrgReg(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1">Утасны дугаар</label>
              <Input
                type="text"
                placeholder="Утасны дугаар"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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

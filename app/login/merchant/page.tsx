"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SrcImage from "../../../public/img/login1.png";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { loginData } from "@/app/data/loginData";

export default function MerchantLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      const user = loginData.find(
        (u) => u.email === identifier && u.password === password && u.role === "merchant"
      );

      if (user) {
        localStorage.setItem("loggedUser", JSON.stringify(user));
        router.replace("/merchant");
      } else {
        setError("Имэйл эсвэл нууц үг буруу байна.");
      }
      setLoading(false);
    }, 700);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <section className="flex w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden">
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h1 className="text-2xl font-semibold text-center mb-6">Байгууллагаар нэвтрэх</h1>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Имэйл эсвэл Байгууллагын код</label>
              <Input
                type="text"
                placeholder="example@mail.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Нууц үг</label>
              <Input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              className="w-full bg-[#5A6DEA] text-white hover:bg-blue-700"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
            </Button>
          </div>
        </div>

        <div className="hidden md:block w-1/2">
          <Image src={SrcImage} alt="Login Illustration" width={512} height={512} />
        </div>
      </section>
    </main>
  );
}

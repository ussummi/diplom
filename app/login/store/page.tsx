"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SrcImage from "../../../public/img/login1.png";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginUser } from "@/app/api/user";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const credentials = { identifier, password };
      const response: any = await loginUser(credentials);

      if (response.success) {
        localStorage.setItem("store_token", response.data.token);
        router.replace("/stores");
      } else {
        setError(response.message || "Нэвтрэхэд алдаа гарлаа");
      }
    } catch (err) {
      console.error(err);
      setError("Системийн алдаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <section className="flex w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden">
        {/* Left form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h1 className="text-2xl font-semibold text-center mb-6">Нэвтрэх </h1>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Байгууллагийн код
              </label>
              <Input
                id="code"
                type="code"
                placeholder="1234567"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium">
                Нууц үг
              </label>
              <Input
                id="password"
                type="password"
                placeholder="*******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-between items-center text-sm">
              <a href="/recover/password" className="text-blue-600 hover:underline">
                Нууц үгээ мартсан уу?
              </a>
              <a href="/register/store" className="text-blue-600 hover:underline">
                Бүртгүүлэх
              </a>
            </div>

            <Button
              className="w-full bg-[#5A6DEA] text-white hover:bg-blue-700 transition-colors duration-300"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
            </Button>
          </div>
        </div>

        {/* Right image */}
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

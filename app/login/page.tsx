"use client";

import { Button } from "@/components/ui/button";
import SrcImage from "../../public/svg/login1.svg";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="flex items-center justify-center min-h-screen bg-white">
      <section className="flex w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden">
        <div className="hidden md:block w-4/8">
          <Image src={SrcImage} alt="Login Illustration" width={512} height={512} />
        </div>

        <div className="w-full md:w-4/8 p-8 flex flex-col justify-center space-y-6">
          <div className="flex justify-center">
            <Image src={"/svg/logo.svg"} alt="Logo" width={120} height={120} className="rounded-full" />
          </div>
          <h1 className="text-2xl font-semibold text-center">Тавтай морилно уу.</h1>

          <Button
            className="w-full bg-[#5A6DEA] text-white hover:bg-blue-700"
            onClick={() => router.push("/login/store")}
          >
            Дэлгүүрээр нэвтрэх
          </Button>

          <Button
            className="w-full bg-[#5A6DEA] text-white hover:bg-blue-700"
            onClick={() => router.push("/login/merchant")}
          >
            Байгууллагаар нэвтрэх
          </Button>
        </div>
      </section>
    </main>
  );
}

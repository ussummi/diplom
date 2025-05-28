"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LogoImage from "../../public/img/icon.png";
import ProfileImage from "../../public/img/profile logo.png";

export default function PagesLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);
  const handleProfileToggle = () => setProfileOpen((prev) => !prev);

  // end hereglegchee taniad role oor n layout iih n menunuud uur haragdana
  const user = {
    name: "Хүнсний дэлгүүр",
    email: "delguur@gmail.com",
    role: "store", // or "store"
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-gray-100 text-sm overflow-hidden">
      <aside
        className={`w-64 bg-blue-600 text-white flex flex-col justify-between py-6 fixed z-10 lg:relative h-screen transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300`}
      >
        <div className="flex flex-col items-center">
          <Image src={LogoImage} alt="Logo" width={160} height={160} className="mb-6" />
          <nav className="flex flex-col space-y-4 text-center w-full">
            {user.role === "merchant" ? (
              <>
                <Link href="/merchant" className="hover:bg-blue-700 py-2">
                  Аж ахуйн нэгжүүд
                </Link>
                <Link href="/merchant/orders" className="hover:bg-blue-700 py-2">
                  Ирсэн захиалга
                </Link>
                <Link href="/merchant/complaints" className="hover:bg-blue-700 py-2">
                  Бүтгэгдсэн гомдол
                </Link>
              </>
            ) : (
              <>
                <Link href="/stores" className="hover:bg-blue-700 py-2">
                  Аж ахуйн нэгжүүд
                </Link>
                <Link href="/orders" className="hover:bg-blue-700 py-2">
                  Миний захиалга
                </Link>
                <Link href="/complaints" className="hover:bg-blue-700 py-2">
                  Гомдол
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="text-xs text-center p-4">Help and Support</div>
      </aside>

      <main className="flex-1 p-6 h-full overflow-auto">
        <button
          className="lg:hidden text-black text-3xl absolute left-6 top-6 z-20"
          onClick={handleMenuToggle}
        >
          ☰
        </button>

        <div className="flex justify-between items-center mb-6">
          <div className="relative w-80 hidden sm:block">
            <input
              type="text"
              placeholder="Хайх . . ."
              className="w-full rounded-full px-4 py-2 border pl-10"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600">
              🔍
            </button>
          </div>

          <div className="relative flex items-center space-x-2 ml-auto cursor-pointer">
            <Image
              src={ProfileImage}
              alt="Profile"
              width={36}
              height={36}
              className="rounded-full"
              onClick={handleProfileToggle}
            />
            <span
              className="text-sm font-medium hidden sm:inline"
              onClick={handleProfileToggle}
            >
              Миний профайл
            </span>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white border rounded shadow-md py-2 w-48 text-sm z-10">
                <p className="px-4 py-2 font-bold">{user.name}</p>
                <p className="px-4 py-2 text-gray-600">{user.email}</p>
                <hr />
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => alert("Гарах үйлдэл")}
                >
                  Гарах
                </button>
              </div>
            )}
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}

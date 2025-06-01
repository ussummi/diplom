"use client";

import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearch } from "@/app/context/SearchContext";
import LogoImage from "../../public/img/icon.png";
import ProfileImage from "../../public/img/profile logo.png";

type User = {
  name: string;
  email: string;
  role: "merchant" | "store";
};

export default function PagesLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { searchTerm, setSearchTerm } = useSearch();
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedUser");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (!user) return <div>Loading...</div>;

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);
  const handleProfileToggle = () => setProfileOpen((prev) => !prev);

  const confirmLogout = () => {
    localStorage.removeItem("loggedUser");
    router.push("/login");
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
                <Link href="/merchant" className="hover:bg-blue-700 py-2">Аж ахуйн нэгжүүд</Link>
                <Link href="/merchant/orders" className="hover:bg-blue-700 py-2">Ирсэн захиалга</Link>
                <Link href="/merchant/complaints" className="hover:bg-blue-700 py-2">Бүтгэгдсэн гомдол</Link>
              </>
            ) : (
              <>
                <Link href="/stores" className="hover:bg-blue-700 py-2">Аж ахуйн нэгжүүд</Link>
                <Link href="/orders" className="hover:bg-blue-700 py-2">Миний захиалга</Link>
                <Link href="/complaints" className="hover:bg-blue-700 py-2">Гомдол</Link>
              </>
            )}
          </nav>
        </div>
        <div className="text-xs text-center p-4">Help and Support</div>
      </aside>

      <main className="flex-1 p-6 h-full overflow-auto relative">
        <button
          className={`lg:hidden absolute left-6 top-6 z-20 transition-colors duration-200 ${
            menuOpen ? "text-white text-sm" : "text-black text-3xl"
          }`}
          onClick={handleMenuToggle}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div className="flex justify-between items-center mb-6">
          <div className="flex-1" />
          <div className="relative w-80 mx-auto ml-10 mr-0 sm:mr-10">
            <input
              type="text"
              placeholder="Хайх . . ."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full px-4 py-2 border pl-10"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600">🔍</button>
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
            <span className="text-sm font-medium hidden sm:inline" onClick={handleProfileToggle}>
              Миний профайл
            </span>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white border rounded shadow-md py-2 w-48 text-sm z-10">
                <p className="px-4 py-2 font-bold">{user.name}</p>
                <p className="px-4 py-2 text-gray-600">{user.email}</p>
                <hr />
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => setShowLogoutDialog(true)}
                >
                  Гарах
                </button>
              </div>
            )}
          </div>
        </div>

        {children}

        {showLogoutDialog && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">Та гарахдаа итгэлтэй байна уу?</h2>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowLogoutDialog(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Буцах
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Гарах
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="container flex flex-col md:flex-row-reverse items-center justify-center text-center p-6 gap-6">
        <div className="w-full md:w-5/8 flex justify-center">
          <Image
            src="/404.svg"
            alt="404 Not Found"
            width={700}
            height={700}
            className="object-contain"
          />
        </div>
        <div className="w-full md:w-3/8 flex flex-col items-center justify-end">
          <h2 className="text-2xl md:text-4xl font-bold mt-4 md:mt-0">
            Уучлаарай....
          </h2>
          <p className="mt-4 text-lg md:text-xl">Таны хайсан хуудас олдсонгүй</p>
          <div className="mt-6">
            <Link href="/stores">
              <button className="bg-blue-600 text-white cursor-pointer px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                Буцах
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

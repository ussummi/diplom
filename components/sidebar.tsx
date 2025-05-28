

export default function Sidebar() {
    return (
      <div className="h-screen w-64 bg-blue-600 text-white flex flex-col items-center py-6 fixed left-0 top-0">
        {/* Logo / Image */}
        <img
          src="/logo.png"
          alt="Logo"
          className="w-24 h-24 mb-6"
        />
  
        {/* Nav Links */}
        <nav className="flex flex-col space-y-4">
          <a href="/stores" className="hover:bg-blue-700 px-4 py-2 rounded">Аж ахуйн нэгжүүд</a>
          <a href="/orders" className="hover:bg-blue-700 px-4 py-2 rounded">Миний захиалга</a>
          <a href="#" className="hover:bg-blue-700 px-4 py-2 rounded">Гомдол</a>
        </nav>
      </div>
    );
  }
  
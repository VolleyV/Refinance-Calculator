const Navbar = () => {
  return (
    <div className="bg-[#082044]">
  <div className="container mx-auto px-4">
    <div className="flex justify-between items-center py-4">
      {/* โลโก้ */}
      <div className="flex items-center">
        <div className="flex items-center space-x-2">
          {/* Icon */}
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#082044] font-bold">★</span>
          </div>
          <div>
            <p className="text-white font-bold text-lg">Financial</p>
            <p className="text-gray-300 text-sm">Site</p>
          </div>
        </div>
      </div>

      {/* เมนู */}
      <nav className="flex gap-6" aria-label="Tabs">
        <a
          href="#"
          className="text-sm font-medium text-green-400 border-b-2 border-green-400 pb-1"
        >
          HOME
        </a>
        <a
          href="#"
          className="text-sm font-medium text-gray-300 hover:text-white hover:border-gray-100 pb-1"
        >
          ABOUT
        </a>
        <a
          href="#"
          className="text-sm font-medium text-gray-300 hover:text-white hover:border-gray-100 pb-1"
        >
          CONTACT
        </a>
      </nav>
    </div>
  </div>
</div>

  );
};

export default Navbar;

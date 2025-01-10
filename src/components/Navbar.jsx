const Navbar = () => {
  return (
    
  
<div>

  {/* Navbar ที่แสดงผลทั้งบนหน้าจอเล็กและใหญ่ */}
  <div className="bg-gray-800">
    <div className="border-b border-gray-200 container mx-auto px-4">
      <div className="flex justify-between items-center py-4">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          <a
            href="C:\Users\ACER\Refinance-Calculator\src\components\BasicForm.jsx"
            className="shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            Logo
          </a>

          <a
            href="C:\Users\ACER\Refinance-Calculator\src\components\BasicForm.jsx"
            className="shrink-0 border-b-2 border-sky-500 px-1 pb-4 text-sm font-medium text-sky-600"
            aria-current="page"
          >
            คำนวณกู้บ้าน
          </a>

          <a
            href="C:\Users\ACER\Refinance-Calculator\src\components\About.jsx"
            className="shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            About
          </a>

          <a
            href="#"
            className="shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            Contact
          </a>
        </nav>
      </div>
    </div>
  </div>
</div>


  );
};

export default Navbar;

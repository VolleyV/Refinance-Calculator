import InputForm from "./components/InputForm";
import Navbar from "./components/Navbar";
import ShowBank from "./components/ShowBank";

import { useState } from "react";

function App() {
  const [formData, setFormData] = useState(null);

  const handleFormSubmit = (data) => {
    setFormData(data);
  };
  return (
    <>
      <div>
        <Navbar className="bg-gray-800" />
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="text-white text-lg font-bold">คำนวณดอกเบี้ย</div>
          </div>
        </div>
      </div>
      <InputForm onSubmit={handleFormSubmit} />
      {formData && <ShowBank data={formData} />}
    </>
  );
}

export default App;

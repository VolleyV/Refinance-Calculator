// import React from 'react';
import AdvanceForm from "./components/AdvanceForm";
// import BasicForm from "./components/BasicForm";
import InputForm from "./components/InputForm";
import Navbar from "./components/Navbar";

function App() {
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
      {/* <BasicForm /> */}
      <InputForm />
      {/* <AdvanceForm /> */}
    </>
  );
}

export default App;

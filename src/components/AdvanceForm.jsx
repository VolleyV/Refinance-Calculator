import React, { useState } from "react";

const AdvanceForm = () => {
  const [isVisible, setIsVisible] = useState(true); // Control visibility for testing

  return (
    <div
      id="advanced-content"
      className={`tab-content ${isVisible ? "" : "hidden"}`}
    >
      <h2 className="text-xl font-bold">
        คำนวณรีไฟแนนซ์แบบมีหลายอัตราดอกเบี้ย
      </h2>
      <form id="loan-form-advance" className="space-y-4">
        {/* Loan Amount */}
        <div>
          <label className="loan" htmlFor="principal-advance">
            จำนวณเงินที่กู้ (บาท)
          </label>
          <input
            name="principal-advance"
            className="w-full rounded-lg border-gray-200 p-3 text-sm"
            style={{ border: "1px solid black" }}
            placeholder="จำนวณเงินที่กู้ (บาท)"
            type="number"
            id="principal-advance"
            step="0.001"
          />
        </div>

        {/* Installment Duration and Start Date */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="ttime" htmlFor="installmentDuration-advance">
              ระยะเวลาผ่อนกี่ปี
            </label>
            <input
              name="installmentDuration-advance"
              className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm"
              style={{ border: "1px solid black" }}
              placeholder="ระยะเวลาผ่อนกี่ปี"
              type="number"
              id="installmentDuration-advance"
            />
          </div>
          <div>
            <label className="tdate" htmlFor="start-date-advance">
              วันที่เริ่มกู้
            </label>
            <input
              name="start-date-advance"
              className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm"
              style={{ border: "1px solid black" }}
              type="date"
              id="start-date-advance"
            />
          </div>
        </div>

        {/* Installment Details */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mt-4">
          {/* Installment From */}
          <div id="installment-from-advance">
            <label>งวดที่</label>
            <input
              className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm"
              style={{ border: "1px solid black" }}
              placeholder="งวดที่"
              type="number"
              value="1"
              readOnly
            />
            {[...Array(3)].map((_, index) => (
              <input
                key={`installment-from-${index}`}
                className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm mt-4"
                style={{ border: "1px solid black" }}
                placeholder="งวดที่"
                type="number"
              />
            ))}
          </div>

          {/* Installment To */}
          <div id="installment-to-advance">
            <label>ถึงงวดที่</label>
            {[...Array(4)].map((_, index) => (
              <input
                key={`installment-to-${index}`}
                className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm mt-4"
                style={{ border: "1px solid black" }}
                placeholder="ถึงงวดที่"
                type="number"
              />
            ))}
          </div>

          {/* Interest Rate */}
          <div id="interest-advance">
            <label>อัตราดอกเบี้ย</label>
            {[...Array(4)].map((_, index) => (
              <input
                key={`interest-${index}`}
                className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm mt-4"
                style={{ border: "1px solid black" }}
                placeholder="อัตราดอกเบี้ย"
                type="number"
                step="0.001"
              />
            ))}
          </div>

          {/* Monthly Payment */}
          <div id="monthlyPayment-advance">
            <label>จำนวนเงินที่จะผ่อน</label>
            {[...Array(4)].map((_, index) => (
              <input
                key={`monthly-payment-${index}`}
                className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm mt-4"
                style={{ border: "1px solid black" }}
                placeholder="จำนวนเงินที่จะผ่อน"
                type="number"
                step="0.001"
              />
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4">
          <button
            type="submit"
            className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
          >
            คำนวณ
          </button>
          <button
            type="reset"
            className="inline-block w-full rounded-lg bg-red-500 px-5 py-3 font-medium text-white sm:w-auto"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdvanceForm;

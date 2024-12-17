import { useState } from "react";

const BasicForm = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [paymentDuration, setPaymentDuration] = useState(1);

  //format ตัวเลข 3 หลัก
  const formatAmount = (value) => {
    return Number(value.replace(/[^0-9]/g, "")).toLocaleString();
  };

  const handleLoanAmountChange = (event) => {
    const { value } = event.target;
    const rawValue = value.replace(/[^0-9]/g, "");

    if (Number(rawValue) <= 999_000_000) {
      const formattedValue = formatAmount(rawValue);
      setLoanAmount(formattedValue);
    }
  };

  const handleDurationChange = (event) => {
    setPaymentDuration(Number(event.target.value));
  };
  return (
    <div>
      <div className="bg-white rounded-b-lg px-6 py-4 shadow-lg">
        <h2 className="text-xl font-bold">
          คำนวณรีไฟแนนซ์แบบอัตราดอกเบี้ยเดียว
        </h2>
        <form>
          <div>
            <div className="relative">
              <input
                type="text"
                name="Loan-Amount"
                className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm"
                onChange={handleLoanAmountChange}
                value={loanAmount}
                placeholder="ใส่จำนวนเงินกู้"
              ></input>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="relative">
              <label
                htmlFor="payment-duration"
                className="block text-l font-medium text-gray-700"
              >
                เลือกระยะเวลาในการผ่อน
              </label>
              <select
                id="payment-duration"
                name="payment-duration"
                onChange={handleDurationChange}
                value={paymentDuration}
                className="w-full rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 p-3 text-sm"
              >
                {Array.from({ length: 40 }, (_, i) => i + 1).map((year) => (
                  <option key={year} value={year}>
                    {year} ปี
                  </option>
                ))}
              </select>
            </div>
            <div className="relative"></div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BasicForm;

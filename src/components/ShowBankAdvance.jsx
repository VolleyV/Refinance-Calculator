import { useNavigate } from "react-router-dom";

const ShowBankAdvance = () => {
  const navigate = useNavigate();

  const handleNavigateToTable = () => {
    navigate("/advanceTable", { state: { activeTab: "advanced" } });
  };
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 mt-10 shadow-lg p-5">
      <div className="h-42 rounded-lg bg-gray-200 p-0 mb-4">
        <div className="h-18 bg-blue-400 p-4 rounded-t-lg">
          <img src="bank50.png" />
        </div>
        <div className="p-3">
          <p>
            <b>3ปีแรก</b>
          </p>
          <p>เงินกู้คงเหลือ: - บาท</p>
          <p>ดอกเบี้ยที่จ่ายไป: - บาท</p>
          <button
            onClick={handleNavigateToTable}
            className="inline-block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
          >
            ดูเพิ่มเติม
          </button>
        </div>
      </div>
      <div className="h-42 rounded-lg bg-gray-200 p-0 mb-4">
        <div className="h-18 bg-blue-400 p-4 rounded-t-lg">
          <img src="bank50.png" />
        </div>
        <div className="p-3">
          <p>
            <b>จนผ่อนจบ</b>
          </p>
          <p>จำนวนปีที่ผ่อน: - ปี - เดือน</p>
          <p>ดอกเบี้ยที่จ่ายไป: - บาท</p>
          <p>วันที่ผ่อนหมด: -</p>
        </div>
      </div>
    </div>
  );
};

export default ShowBankAdvance;

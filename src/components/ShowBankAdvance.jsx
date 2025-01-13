
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ShowBankAdvance = ({ advanceCalculateSummary }) => {
  const navigate = useNavigate();
  const handleNavigateToTable = () => {
    navigate("/advanceTable", { state: { activeTab: "advanced" } });
  };
  // const handleOpenTableInNewTab = () => {
  //   sessionStorage.setItem(
  //     "basicTableData",
  //     JSON.stringify(advanceCalculateSummary)
  //   );
  //   window.open("/advanceTable", "_blank");
  // };

  const totalLoanRemaining = advanceCalculateSummary.loanAmountAfterThreeYears;
  const totalInterestThreeYears =
    advanceCalculateSummary.totalInterestThreeYears;
  const {
    principalPortionAfterThreeYears,
    insurance,
    mortgageFee,
    total,
    totalYears,
    totalMonths,
    totalInterestPaid,
    lastDayOfPaying,
  } = advanceCalculateSummary;

  const remainingDateText = `ระยะเวลาผ่อนชำระ: ${totalYears} ปี ${totalMonths} เดือน`;

  const remainingInterestText = `ดอกเบี้ยสุทธิ: ${parseFloat(
    totalInterestPaid
  ).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} บาท`;

  const lastPaymentText = `สิ้นสุดการชำระ ณ วันที่: ${new Date(
    lastDayOfPaying
  ).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  })}`;

  return (
    <div className="relative p-6 max-w-4xl mx-auto rounded-lg mt-8 bg-white">
      {/* ส่วนข้อมูล */}
      <div className="flex flex-col gap-8">
        {/* ส่วนข้อมูลระยะเวลา 3 ปีแรก */}
        <div className="p-6 border-b border-[#D3D8E2]">
          <h2 className="text-lg font-bold text-[#082044] text-center">ผ่อน 3 ปี แรก</h2>
          <p className="text-[#82828E] text-sm text-center mt-1">(จำนวนเงิน 396,000 บาท)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center mt-6">
            <div className="flex justify-center">
              {/* วงกลม */}
              <div className="relative w-32 h-32">
                <div className="w-full h-full rounded-full border-[6px] border-[#082044] border-b-[#D3D8E2]"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-sm">
                  <p className="text-[#082044] font-bold">ดอกเบี้ย</p>
                  <p className="text-[#82828E]">เงินต้น</p>
                </div>
              </div>
            </div>
            <div className="text-sm space-y-2">
              <p>
                ผ่อนเงินต้นไป{" "}
                <br />
                <span className="font-bold text-[#30A572]">{principalPortionAfterThreeYears.toLocaleString()}</span> บาท
              </p>
              <p>
                ผ่อนดอกเบี้ยไป{" "}
                <br />  <span className="font-bold text-[#30A572]">{totalInterestThreeYears.toLocaleString()}</span> บาท
              </p>
              <p>
                เหลือเงินต้นต้องผ่อนอีก{" "}
                <br /> <span className="font-bold text-[#30A572]">{totalLoanRemaining.toLocaleString()}</span> บาท
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* ส่วนข้อมูลจนถึงสิ้นสุดการชำระ */}
      <div className="p-6">
        <h2 className="text-lg font-bold text-[#082044] text-center">
          จะผ่อนหมดต้องใช้เวลา {remainingDateText}
        </h2>
        <p className="text-[#82828E] text-sm text-center mt-1">
          ({lastPaymentText})
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center mt-6">
          <div className="flex justify-center">
            {/* วงกลม */}
            <div className="relative w-32 h-32">
              <div className="w-full h-full rounded-full border-[6px] border-[#082044] border-b-[#D3D8E2]"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-sm">
                <p className="text-[#082044] font-bold">ดอกเบี้ย</p>
                <p className="text-[#82828E]">เงินต้น</p>
              </div>
            </div>
          </div>
          <div className="text-sm space-y-2">
            <p className="text-[#35373F]">
              รวมเงินผ่อนทั้งหมด
              <br />
              <span className="font-bold text-[#30A572]">1,650,000</span>
              <span> บาท</span>
            </p>

            <p>
              รวมค่าดอกเบี้ยตลอดระยะเวลาผ่อน{" "}
              <br />
              <span className="font-bold text-[#30A572]">{remainingInterestText.toLocaleString()}</span>
              <span> บาท</span>
            </p>

          </div>
        </div>
      </div>
      
      {/* ปุ่มดูรายละเอียด */ }
  <div className="mt-6 text-center">
    <button
      onClick={handleNavigateToTable}
      className="inline-block rounded-full bg-[#30A572] px-8 py-2 text-sm font-bold text-white hover:bg-[#28a062]"
    >
      ดูรายละเอียด
    </button>
  </div>
    </div>
  );
};

ShowBankAdvance.propTypes = {
  advanceCalculateSummary: PropTypes.shape({
    loanAmountAfterThreeYears: PropTypes.number.isRequired,
    totalInterestThreeYears: PropTypes.number.isRequired,
    principalPortionAfterThreeYears: PropTypes.number.isRequired,
    totalYears: PropTypes.number.isRequired,
    totalMonths: PropTypes.number.isRequired,
    totalInterestPaid: PropTypes.number.isRequired,
    lastDayOfPaying: PropTypes.string.isRequired,
  }).isRequired,
};

export default ShowBankAdvance;

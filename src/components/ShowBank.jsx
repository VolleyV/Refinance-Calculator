import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const ShowBank = ({ CalculateSummary }) => {
  const navigate = useNavigate();

  const handleNavigateToTable = () => {
    navigate("/basicTab", { state: { activeTab: "basic" } });
  };

  const totalPrincipal =
    CalculateSummary.principalAfterThreeYears.toLocaleString() || "N/A";
  const totalInterest =
    CalculateSummary.totalInterestThreeYears.toLocaleString();
  const totalLastYears =
    CalculateSummary.totalLastYears.toLocaleString() || "N/A";
  const remainingMonths =
    CalculateSummary.remainingMonths.toLocaleString() || "N/A";
  const totalLastInterest =
    CalculateSummary.totalLastInterest.toLocaleString() || "N/A";
  const lastPaymentDate =
    CalculateSummary.lastPaymentDate.toLocaleString() || "N/A";

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
          <p>เงินกู้คงเหลือ: {totalPrincipal} บาท</p>
          <p>ดอกเบี้ยที่จ่ายไป: {totalInterest} บาท</p>
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
          <p>
            จำนวนปีที่ผ่อน: {totalLastYears} ปี {remainingMonths} เดือน
          </p>
          <p>ดอกเบี้ยที่จ่ายไป: {totalLastInterest} บาท</p>
          <p>วันที่ผ่อนหมด: {lastPaymentDate}</p>
        </div>
      </div>
    </div>
  );
};

ShowBank.propTypes = {
  CalculateSummary: PropTypes.shape({
    principalAfterThreeYears: PropTypes.number.isRequired,
    totalInterestThreeYears: PropTypes.number.isRequired,
    totalLastYears: PropTypes.number.isRequired,
    remainingMonths: PropTypes.number.isRequired,
    totalLastInterest: PropTypes.number.isRequired,
    lastPaymentDate: PropTypes.string.isRequired,
  }),
};

export default ShowBank;

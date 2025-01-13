import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const ShowBank = ({ basicCalculateSummary }) => {
  // const handleOpenTableInNewTab = () => {
  //   sessionStorage.setItem(
  //     "basicTableData",
  //     JSON.stringify(basicCalculateSummary)
  //   );
  //   window.open("/basicTab", "_blank");
  // };

  const navigate = useNavigate();
  const handleNavigateToTable = () => {
    navigate("/basicTab", { state: { activeTab: "basic" } });
  };

  const {
    principalAfterThreeYears,
    totalInterestThreeYears,
    principalPortionAfterThreeYears,
    totalYears,
    totalMonths,
    totalInterestPaid,
    lastDayOfPaying,
  } = basicCalculateSummary;

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
    <div className="relative p-6 max-w-4xl mx-auto rounded-lg shadow-md mt-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="h-42 rounded-lg bg-gray-200 p-0 flex-1">
          <div className="h-18 bg-blue-400 p-4 rounded-t-lg">
            <img src="bank50.png" alt="Bank Logo" />
          </div>
          <div className="p-3">
            <p>
              <b>ระยะเวลาเริ่มผ่อนชำระงวด 3 ปีแรกเริ่ม</b>
            </p>
            <p>
              เงินกู้คงเหลือ: {principalAfterThreeYears.toLocaleString()} บาท
            </p>
            <p>ดอกเบี้ยสุทธิ: {totalInterestThreeYears.toLocaleString()} บาท</p>
            <p>
              เงินต้นที่สุทธิ:{" "}
              {principalPortionAfterThreeYears.toLocaleString()} บาท
            </p>
            <button
              onClick={handleNavigateToTable}
              // onClick={handleOpenTableInNewTab}
              className="inline-block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
            >
              ดูเพิ่มเติม
            </button>
          </div>
        </div>
        <div className="h-42 rounded-lg bg-gray-200 p-0 flex-1">
          <div className="h-18 bg-blue-400 p-4 rounded-t-lg">
            <img src="bank50.png" alt="Bank Logo" />
          </div>
          <div className="p-3">
            <p>
              <b>ระยะเวลาจนถึงสิ้นสุดการชำระ</b>
            </p>
            <p>{remainingDateText}</p>
            <p>{lastPaymentText}</p>
            <p>{remainingInterestText.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

ShowBank.propTypes = {
  basicCalculateSummary: PropTypes.shape({
    principalAfterThreeYears: PropTypes.number.isRequired,
    totalInterestThreeYears: PropTypes.number.isRequired,
    principalPortionAfterThreeYears: PropTypes.number.isRequired,
    totalYears: PropTypes.number.isRequired,
    totalMonths: PropTypes.number.isRequired,
    totalInterestPaid: PropTypes.number.isRequired,
    lastDayOfPaying: PropTypes.string.isRequired,
  }).isRequired,
};

export default ShowBank;

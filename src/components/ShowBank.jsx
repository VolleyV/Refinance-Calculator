import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const ShowBank = ({ basicCalculateSummary }) => {
  const navigate = useNavigate();

  const handleNavigateToTable = () => {
    navigate("/basicTab", { state: { activeTab: "basic" } });
  };

  const {
    principalAfterThreeYears,
    totalInterestThreeYears,
    fullyPaid,
    totalYears,
    totalMonths,
    remainingDate,
    remainingInterest,
    totalInterestPaid,
    lastDayOfPaying,
  } = basicCalculateSummary;

  const remainingDateText = fullyPaid
    ? `ผ่อนดอกเบี้ยจนหมด ใช้เวลาทั้งหมด ${totalYears} ปี ${totalMonths} เดือน`
    : `ผ่อนไปแล้ว ${totalYears - remainingDate.years} ปี ${
        totalMonths - remainingDate.months
      } เดือน และยังเหลืออีก ${remainingDate.years} ปี ${
        remainingDate.months
      } เดือน`;

  const remainingInterestText = fullyPaid
    ? `ผ่อนดอกเบี้ยทั้งหมดแล้วเป็นจำนวนเงิน ${parseFloat(
        totalInterestPaid
      ).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} บาท`
    : `ดอกเบี้ยที่ต้องจ่ายเพิ่มอีกจนกว่าจะครบ ${parseFloat(
        remainingInterest
      ).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} บาท`;

  const lastPaymentText = fullyPaid
    ? `ผ่อนหมดในวันที่ ${lastDayOfPaying}`
    : `จะผ่อนดอกเบี้ยจนหมดในวันที่ ${lastDayOfPaying}`;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 mt-10 shadow-lg p-5">
      <div className="h-42 rounded-lg bg-gray-200 p-0 mb-4">
        <div className="h-18 bg-blue-400 p-4 rounded-t-lg">
          <img src="bank50.png" />
        </div>
        <div className="p-3">
          <p>
            <b>ผ่อน 3 ปีแรก</b>
          </p>

          <p>เงินกู้คงเหลือ: {principalAfterThreeYears.toLocaleString()} บาท</p>
          <p>
            ดอกเบี้ยที่จ่ายไป: {totalInterestThreeYears.toLocaleString()} บาท
          </p>
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
          <p>{remainingDateText}</p>
          <p>{remainingInterestText.toLocaleString()}</p>
          <p>{lastPaymentText}</p>
        </div>
      </div>
    </div>
  );
};

ShowBank.propTypes = {
  basicCalculateSummary: PropTypes.shape({
    principalAfterThreeYears: PropTypes.number.isRequired,
    totalInterestThreeYears: PropTypes.number.isRequired,
    fullyPaid: PropTypes.bool.isRequired,
    totalYears: PropTypes.number.isRequired,
    totalMonths: PropTypes.number.isRequired,
    remainingDate: PropTypes.shape({
      years: PropTypes.number.isRequired,
      months: PropTypes.number.isRequired,
    }),
    remainingInterest: PropTypes.number.isRequired,
    totalInterestPaid: PropTypes.number.isRequired,
    lastDayOfPaying: PropTypes.string.isRequired,
  }).isRequired,
};

export default ShowBank;

import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ShowBankAdvance = ({ advanceCalculateSummary }) => {
  const navigate = useNavigate();

  const totalLoanRemaining = advanceCalculateSummary.loanAmountAfterThreeYears;
  const totalInterestThreeYears =
    advanceCalculateSummary.totalInterestThreeYears;
  const {
    fullyPaid,
    totalYears,
    totalMonths,
    remainingDate,
    remainingInterest,
    totalInterestPaid,
    lastDayOfPaying,
  } = advanceCalculateSummary;

  const remainingDateText = fullyPaid
    ? `ผ่อนดอกเบี้ยจนหมด ใช้เวลาทั้งหมด ${totalYears} ปี ${totalMonths} เดือน`
    : `ผ่อนไปแล้ว ${totalYears - remainingDate.years} ปี ${totalMonths - remainingDate.months
    } เดือน และยังเหลืออีก ${remainingDate.years} ปี ${remainingDate.months
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

  const handleNavigateToTable = () => {
    navigate("/advanceTable", { state: { activeTab: "advanced" } });
  };
  return (
    <div className="relative p-6 max-w-4xl mx-auto rounded-lg shadow-md mt-8">
    <div className="flex gap-4">
      <div className="h-42 rounded-lg bg-gray-200 p-0 mb-4 flex-1">
        <div className="h-18 bg-blue-400 p-4 rounded-t-lg">
          <img src="bank50.png" />
        </div>
        <div className="p-3">
            <p>
              <b>3ปีแรก</b>
            </p>
            <p>เงินกู้คงเหลือ: {totalLoanRemaining.toLocaleString()} บาท</p>
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
        <div className="h-42 rounded-lg bg-gray-200 p-0 mb-4 flex-1">
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
    </div>
  );
};

ShowBankAdvance.propTypes = {
  advanceCalculateSummary: PropTypes.shape({
    loanAmountAfterThreeYears: PropTypes.number.isRequired,
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

export default ShowBankAdvance;

import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const ShowBank = ({ threeYearSummary }) => {
  const navigate = useNavigate();

  const handleNavigateToTable = () => {
    if (!threeYearSummary) {
      console.error("Incomplete data");
      return;
    }
    navigate("/table");
  };

  const totalPrincipal =
    threeYearSummary.principalAfterThreeYears.toLocaleString();
  const totalInterest =
    threeYearSummary.totalInterestThreeYears.toLocaleString();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 mt-10">
      <div className="h-42 rounded-lg bg-gray-200 p-0 mb-4">
        <div className="h-18 bg-blue-400 p-4 rounded-t-lg">
          <img src="bank50.png" />
        </div>
        <div className="p-3">
          <label>
            <b>3ปีแรก</b>
          </label>
          <br />
          <label>
            เงินกู้คงเหลือ: {totalPrincipal}
            <span id="remainingPrincipal">-</span>
          </label>
          <br />
          <label>
            ดอกเบี้ยที่จ่ายไป: {totalInterest}
            <span id="totalInterest">-</span>
          </label>
          <br />
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
          <label>
            <b>จนผ่อนจบ</b>
          </label>
          <br />
          <label>
            เงินกู้คงเหลือ: <span id="remainingPrincipal2">-</span>
          </label>
          <br />
          <label>
            ดอกเบี้ยที่จ่ายไป: <span id="totalInterest2">-</span>
          </label>
          <br />
          <button
            onClick={handleNavigateToTable}
            className="inline-block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
          >
            ดูเพิ่มเติม
          </button>
        </div>
      </div>
    </div>
  );
};

ShowBank.propTypes = {
  threeYearSummary: PropTypes.shape({
    principalAfterThreeYears: PropTypes.number.isRequired,
    totalInterestThreeYears: PropTypes.number.isRequired,
  }),
};

export default ShowBank;
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

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
    totalMonthlyPaymentThreeYears,
    totalYears,
    totalMonths,
    totalInterestPaid,
    totalMonthlyPayment,
    lastDayOfPaying,
  } = basicCalculateSummary;

  const remainingDateText = `ระยะเวลาผ่อนชำระ: ${totalYears} ปี ${totalMonths} เดือน`;

  const remainingInterestText = `${totalInterestPaid.toLocaleString()} `;

  const lastPaymentText = `สิ้นสุดการชำระ ณ วันที่: ${new Date(
    lastDayOfPaying
  ).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  })}`;

  const circleThreeYears = {
    labels: ["เงินต้น", "ดอกเบี้ย"],
    datasets: [
      {
        label: "# of Votes",
        data: [principalPortionAfterThreeYears,totalInterestThreeYears],
        backgroundColor: ["#082044", "#82828E"],
      },
    ],
  };
  const circleAllYears = {
    labels: ["เงินต้น", "ดอกเบี้ย"],
    datasets: [
      {
        label: "# of Votes",
        data: [totalMonthlyPayment, totalInterestPaid],
        backgroundColor: ["#082044", "#82828E"],
      },
    ],
  };

  const options = {
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom", // Moves labels below the chart
        labels: {
          font: {
            size: 14, // Adjust font size for the legend
            family: "'Noto Sans Thai', sans-serif",
          },
          padding: 20, // Adjust spacing between legend items
          boxWidth: 15, // Adjust box size (color boxes in the legend)
        },
      },
    },
  };

  return (
    <div className="relative p-6 max-w-4xl mx-auto rounded-lg mt-8 bg-white">
      {/* ส่วนข้อมูล */}
      <div className="flex flex-col gap-8">
        {/* ส่วนข้อมูลระยะเวลา 3 ปีแรก */}
        <div className="p-6 border-b border-[#D3D8E2]">
          <h2 className="text-lg font-bold text-[#082044] text-center">
            ผ่อน 3 ปี แรก
          </h2>
          <p className="text-[#82828E] text-sm text-center mt-1">
            (จำนวนเงิน {totalMonthlyPaymentThreeYears.toLocaleString()} บาท)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center mt-6">
            <div className="flex justify-center">
              {/* วงกลม */}
              <div className="relative w-32 h-32">
                <div className="relative w-48 h-48">
                  <Doughnut data={circleThreeYears} options={options} />
                </div>
              </div>
            </div>
            <div className="text-sm space-y-2">
              <p>
                ผ่อนเงินต้นไป <br />
                <span className="font-bold text-[#30A572]">
                  {principalPortionAfterThreeYears.toLocaleString()}
                </span>{" "}
                บาท
              </p>
              <p>
                ผ่อนดอกเบี้ยไป <br />{" "}
                <span className="font-bold text-[#30A572]">
                  {totalInterestThreeYears.toLocaleString()}
                </span>{" "}
                บาท
              </p>
              <p>
                เหลือเงินต้นต้องผ่อนอีก <br />{" "}
                <span className="font-bold text-[#30A572]">
                  {principalAfterThreeYears.toLocaleString()}
                </span>{" "}
                บาท
              </p>
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
                <div className="relative w-48 h-48">
                  <Doughnut data={circleAllYears} options={options} />
                </div>
              </div>
            </div>
            <div className="text-sm space-y-2">
              <p className="text-[#35373F]">
                รวมเงินผ่อนทั้งหมด
                <br />
                <span className="font-bold text-[#30A572]">
                  {totalMonthlyPayment.toLocaleString()}
                </span>
                <span> บาท</span>
              </p>

              <p>
                รวมค่าดอกเบี้ยตลอดระยะเวลาผ่อน <br />
                <span className="font-bold text-[#30A572]">
                  {remainingInterestText.toLocaleString()}
                </span>
                <span> บาท</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ปุ่มดูรายละเอียด */}
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

ShowBank.propTypes = {
  basicCalculateSummary: PropTypes.shape({
    principalAfterThreeYears: PropTypes.number.isRequired,
    totalInterestThreeYears: PropTypes.number.isRequired,
    principalPortionAfterThreeYears: PropTypes.number.isRequired,
    totalMonthlyPaymentThreeYears: PropTypes.number.isRequired,
    totalYears: PropTypes.number.isRequired,
    totalMonths: PropTypes.number.isRequired,
    totalInterestPaid: PropTypes.number.isRequired,
    totalMonthlyPayment: PropTypes.number.isRequired,
    lastDayOfPaying: PropTypes.string.isRequired,
  }).isRequired,
};

export default ShowBank;

/* eslint-disable no-unused-vars */
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
        data: [principalPortionAfterThreeYears, totalInterestThreeYears],
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
      <div className="flex flex-col">
        {/* ส่วนข้อมูลระยะเวลา 3 ปีแรก */}
        <div>
          <h2 className="text-2xl font-bold text-[#082044] text-center">
            ผ่อน 3 ปี แรก
          </h2>
          <p className="text-[#82828E] text-lg text-center mt-2">
            (จำนวนเงิน {totalMonthlyPaymentThreeYears.toLocaleString()} บาท)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center mt-8">
            {/* วงกลม */}
            <div className="flex justify-center">
              <div className="w-36 h-36">
                <div className="w-56 h-56">
                  <Doughnut data={circleThreeYears} options={options} />
                </div>
              </div>
            </div>
            <div className="text-lg space-y-4">
              <div className="flex justify-between items-center">
                <p>
                  ผ่อนเงินต้นไป <br />
                  <span className="font-bold text-[#30A572] text-xl">
                    {principalPortionAfterThreeYears.toLocaleString()}
                  </span>{" "}
                  บาท
                </p>
                <p>
                  ผ่อนดอกเบี้ยไป <br />{" "}
                  <span className="font-bold text-[#30A572] text-xl">
                    {totalInterestThreeYears.toLocaleString()}
                  </span>{" "}
                  บาท
                </p>
              </div>
              <p>
                เหลือเงินต้นต้องผ่อนอีก <br />{" "}
                <span className="font-bold text-[#30A572] text-xl">
                  {principalAfterThreeYears.toLocaleString()}
                </span>{" "}
                บาท
              </p>
            </div>
          </div>
        </div>

        {/* เส้นแบ่ง */}
        <div className="border-t border-[#D3D8E2] my-20"></div>

        {/* ส่วนข้อมูลจนึงสิ้นสุดการชำระ */}
        <div>
          <h2 className="text-2xl font-bold text-[#082044] text-center">
            จะผ่อนหมดต้องใช้เวลา {remainingDateText}
          </h2>
          <p className="text-[#82828E] text-lg text-center mt-2">
            ({lastPaymentText})
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center mt-8">
            <div className="flex justify-center">
              {/* วงกลม */}
              <div className="relative w-36 h-36">
                <div className="relative w-56 h-56">
                  <Doughnut data={circleAllYears} options={options} />
                </div>
              </div>
            </div>
            <div className="text-lg space-y-4">
              <p className="text-[#35373F]">
                รวมเงินผ่อนทั้งหมด
                <br />
                <span className="font-bold text-[#30A572] text-xl">
                  {totalMonthlyPayment.toLocaleString()}
                </span>
                <span> บาท</span>
              </p>

              <p>
                รวมค่าดอกเบี้ยตลอดระยะเวลาผ่อน <br />
                <span className="font-bold text-[#30A572] text-xl">
                  {remainingInterestText.toLocaleString()}
                </span>
                <span> บาท</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ปุ่มดูรายลเยีด */}
      <div className="mt-20 text-center">
        <button
          onClick={handleNavigateToTable}
          className="inline-block rounded-full bg-[#30A572] px-8 py-2 text-lg font-bold text-white hover:bg-[#28a062]"
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

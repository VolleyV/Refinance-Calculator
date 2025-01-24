/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

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
    totalMonthlyPaymentThreeYears,
    insurance,
    mortgageFee,
    total,
    totalYears,
    totalMonths,
    totalInterestPaid,
    totalMonthlyPayment,
    lastDayOfPaying,
  } = advanceCalculateSummary;

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
    cutout: "70%",
    plugins: {
      legend: {
        display: false, // Disable the built-in legend
      },
    },
  };
  const totalInsuranceMortgage = insurance + mortgageFee;

  const remainingDateText = `ระยะเวลาผ่อนชำระ: ${totalYears} ปี ${totalMonths} เดือน`;

  const remainingInterestText = `${totalInterestPaid.toLocaleString()} `;

  const lastPaymentText = `สิ้นสุดการชำระ ณ วันที่: ${new Date(
    lastDayOfPaying
  ).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  })}`;

  return (
    <div className="relative p-6 max-w-4xl mx-auto rounded-lg mt-8 bg-white">

        <div >
          <h2 className="text-xl text-[#082044] text-center">
            หากผ่อนเดือนละ 11,000 บาท
          </h2>
          <h2 className="text-4xl font-bold text-[#082044] text-center mt-4">
            จะผ่อนจบ ต้องใช้เวลา 12 ปี 6 เดือน
          </h2>
        </div>

        {/* เส้นแบ่ง */}
        <div className="border-t-[3px] border-[#082044] my-20 mt-10 mb-10"></div>

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
              {/* วงกลม 3 ปี */}
              <div className="flex justify-center">
                <div className="flex items-center">
                  {/* Legend (left side) */}
                  <div className="space-y-2 mr-4">
                    {circleThreeYears.labels.map((label, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4"
                          style={{
                            backgroundColor:
                              circleThreeYears.datasets[0].backgroundColor[index],
                          }}
                        ></div>
                        <span className="text-sm font-medium">{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Chart (right side) */}
                  <div className="w-48 h-48">
                    <Doughnut data={circleThreeYears} options={options} />
                  </div>
                </div>
              </div>
              <div className="text-lg grid grid-cols-2 gap-8">
                <div className="flex flex-col items-start space-y-4">
                  <p className="relative sm:pl-0 pl-5 sm:before:content-none before:content-['➤'] before:absolute before:left-0 before:text-[#30A572] before:text-xl">
                    ผ่อนดอกเบี้ยไป <br />
                    <span className="font-bold text-[#30A572] text-2xl">
                      {totalInterestThreeYears.toLocaleString()}
                    </span>{" "}
                    <b>บาท</b>
                  </p>
                  <p className="relative sm:pl-0 pl-5 sm:before:content-none before:content-['➤'] before:absolute before:left-0 before:text-[#30A572] before:text-xl">
                    ค่าดอกเบี้ยรวมค่า <br />
                    จดจำนองและค่าประกัน <br />
                    <span className="font-bold text-[#30A572] text-2xl">
                      {totalInsuranceMortgage.toLocaleString()}
                    </span>{" "}
                    <b>บาท</b>
                  </p>
                </div>

                <div className="flex flex-col items-start space-y-4">
                  <p className="relative sm:pl-0 pl-5 sm:before:content-none before:content-['➤'] before:absolute before:left-0 before:text-[#30A572] before:text-xl">
                    ผ่อนเงินต้นไป <br />
                    <span className="font-bold text-[#30A572] text-2xl">
                      {principalPortionAfterThreeYears.toLocaleString()}
                    </span>{" "}
                    <b>บาท</b>
                  </p>

                  <p className="relative sm:pl-0 pl-5 sm:before:content-none before:content-['➤'] before:absolute before:left-0 before:text-[#30A572] before:text-xl">
                    เหลือเงินต้นต้องผ่อนอีก <br />
                    <span className="font-bold text-[#30A572] text-2xl">
                      {totalLoanRemaining.toLocaleString()}
                    </span>{" "}
                    <b>บาท</b>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* เส้นแบ่ง */}
          <div className="border-t border-[#D3D8E2] my-20"></div>

          {/* ส่วนข้อมูลจนถึงสิ้นสุดการชำระ */}
          <div>
            <h2 className="text-2xl font-bold text-[#082044] text-center">
              จะผ่อนหมดต้องใช้เวลา {remainingDateText}
            </h2>
            <p className="text-[#82828E] text-lg text-center mt-2">
              ({lastPaymentText})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center mt-8">
              <div className="flex justify-center">
                {/* วงกลม ทุกปี*/}
                <div className="flex justify-center">
                  <div className="flex items-center">
                    {/* Legend (left side) */}
                    <div className="space-y-2 mr-4">
                      {circleAllYears.labels.map((label, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div
                            className="w-4 h-4"
                            style={{
                              backgroundColor:
                                circleAllYears.datasets[0].backgroundColor[index],
                            }}
                          ></div>
                          <span className="text-sm font-medium">{label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Chart (right side) */}
                    <div className="w-48 h-48">
                      <Doughnut data={circleAllYears} options={options} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-lg space-y-4">
                <p>
                  รวมเงินผ่อนทั้งหมด
                  <br />
                  <span className="font-bold text-[#30A572] text-xl">
                    {totalMonthlyPayment.toLocaleString()}
                  </span>
                  <span>
                    {" "}
                    <b>บาท</b>
                  </span>
                </p>
                <p>
                  รวมค่าดอกเบี้ยตลอดระยะเวลาผ่อน <br />
                  <span className="font-bold text-[#30A572] text-xl">
                    {remainingInterestText.toLocaleString()}
                  </span>
                  <span>
                    <b>บาท</b>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ปุ่มดูรายละเอียด */}
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

      ShowBankAdvance.propTypes = {
        advanceCalculateSummary: PropTypes.shape({
        loanAmountAfterThreeYears: PropTypes.number.isRequired,
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

      export default ShowBankAdvance;

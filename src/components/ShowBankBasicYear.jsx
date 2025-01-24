/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

const ShowBankBasicYear = ({ basicYearCalculateSummary }) => {
  const navigate = useNavigate();

  const handleNavigateToTable = () => {
    navigate("/basicYearTable", { state: { activeTab: "basicYear" } });
  };

  // const handleOpenTableInNewTab = () => {
  //   sessionStorage.setItem(
  //     "basicTableData",
  //     JSON.stringify(basicYearCalculateSummary)
  //   );
  //   window.open("/basicYearTable", "_blank");
  // };

  const {
    principalAfterThreeYears,
    totalInterestThreeYears,
    principalPortionAfterThreeYears,
    totalMonthlyPaymentThreeYears,
    paymentDuration,
    monthlyPayment,
    totalYears,
    totalMonths,
    totalInterestPaid,
    totalMonthlyPayment,
    lastDayOfPaying,
  } = basicYearCalculateSummary;

  const remainingDateText = `ระยะเวลาผ่อนชำระ ${totalYears} ปี ${totalMonths} เดือน`;

  const remainingInterestText = `${totalInterestPaid.toLocaleString()}`;

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
    cutout: "70%",
    plugins: {
      legend: {
        display: false, // Disable the built-in legend
      },
    },
  };

  return (
    <div className="relative p-6 max-w-4xl mx-auto rounded-lg mt-8 bg-white">
      <div>
        <h2 className="text-xl text-[#082044] text-center">
          หากต้องการผ่อนหมดภายใน {paymentDuration} ปี
        </h2>
        <h2 className="text-4xl font-bold text-[#082044] text-center mt-4">
          ต้องผ่อนอย่างน้อยเดือนละ {monthlyPayment.toLocaleString()} บาท
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
          <p className="text-[#082044] text-lg text-center mt-2">
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
            <div className="text-lg space-y-4">
              <div className="flex justify-between items-center">
                <p className="border-2 border-dashed border-[#bbbbbb] p-4 rounded-md">
                  ผ่อนดอกเบี้ยไป <br />{" "}
                  <span className="font-bold text-[#30A572] text-2xl">
                    {totalInterestThreeYears.toLocaleString()}
                  </span>{" "}
                  <b>บาท</b>
                </p>

                <p className="p-4">
                  ผ่อนเงินต้นไป <br />
                  <span className="font-bold text-[#30A572] text-2xl">
                    {principalPortionAfterThreeYears.toLocaleString()}
                  </span>{" "}
                  <b>บาท</b>
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="flex-col p-4">
                  ดอกเบี้ยรวมค่า
                  <br />
                  จดจำนองและค่าประกัน <br />{" "}
                  <span className="font-bold text-[#30A572] text-2xl">
                    {principalAfterThreeYears.toLocaleString()}
                  </span>{" "}
                  <b>บาท</b>
                </p>
                <p className="flex-col mt-7">
                  เหลือเงินต้นต้องผ่อนอีก <br />{" "}
                  <span className="font-bold text-[#30A572] text-2xl">
                    {principalAfterThreeYears.toLocaleString()}
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
            ผ่อนจนเสร็จสิ้น
          </h2>
          <p className="text-[#082044] text-lg text-center mt-2">
            (จำนวณเงิน {remainingInterestText.toLocaleString()} บาท)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center mt-8">
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
            <div className="text-lg space-y-4">
              <p className="border-2 border-dashed border-[#bbbbbb] p-4 rounded-md w-60">
                ค่าดอกเบี้ยตลอดการผ่อน <br />
                <span className="font-bold text-[#30A572] text-2xl">
                  {totalMonthlyPayment.toLocaleString()}
                </span>{" "}
                <b>บาท</b>
              </p>
              <p className="p-4">
                จะผ่อนเสร็จวันที่ <br />
                <span className="font-bold text-[#30A572] text-2xl">
                  {lastPaymentText}
                </span>{" "}
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

ShowBankBasicYear.propTypes = {
  basicYearCalculateSummary: PropTypes.shape({
    principalAfterThreeYears: PropTypes.number.isRequired,
    totalInterestThreeYears: PropTypes.number.isRequired,
    principalPortionAfterThreeYears: PropTypes.number.isRequired,
    totalMonthlyPaymentThreeYears: PropTypes.number.isRequired,
    monthlyPayment: PropTypes.number.isRequired,
    totalYears: PropTypes.number.isRequired,
    totalMonths: PropTypes.number.isRequired,
    totalInterestPaid: PropTypes.number.isRequired,
    totalMonthlyPayment: PropTypes.number.isRequired,
    lastDayOfPaying: PropTypes.string.isRequired,
  }).isRequired,
};

export default ShowBankBasicYear;
